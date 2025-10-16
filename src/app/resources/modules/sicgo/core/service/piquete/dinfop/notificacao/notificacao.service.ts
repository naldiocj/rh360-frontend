import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { debounceTime, distinctUntilChanged, map, Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
 
export interface Notificacao {
  _id: string;
  tipo: 'email' | 'success' | 'warning' | 'danger' | 'info' | 'error'; // pode expandir
  mensagem: string;
  orgao: string | null;
  user_id: number;
  ocorrencia_id: string | null;
  destinatario_email: string;
  lido: boolean;
  createdAt: string;  // ou Date, se você converter depois
  updatedAt: string;
}


@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {
  private readonly api = '/api/v1/sicgo';
  private readonly base = `${this.api}/notificacoes`;
  private readonly socket: Socket;

  private notificationSubject = new Subject<Notificacao>();
  public notification$ = this.notificationSubject.asObservable();

  constructor(private httpApi: ApiService, private http: HttpClient) {
    // Conexão com Socket.IO
    this.socket = io(this.base, {
      transports: ['websocket']
    });

    // Ouvir evento do servidor
    this.socket.on('nova_ocorrencia', (data: Notificacao) => {
      this.notificationSubject.next(data);
    });
  }

  // Envia notificação manual (por componentes, uso interno)
  notify(
    message: string,
    tipo: Notificacao['tipo'] = 'info'
  ): void {
    this.notificationSubject.next({
      _id: 'local-' + Date.now(),
      mensagem: message,
      tipo,
      orgao: null,
      user_id: 0,
      ocorrencia_id: null,
      destinatario_email: '',
      lido: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // 🟢 CRUD + Utilitários ----------------------

  listarTodos(options?: any): Observable<Notificacao[]> {
    return this.httpApi.get(this.base, options);
  }  

  ver(id: string | number): Observable<Notificacao> {
    return this.httpApi.get(`${this.base}/${id}`).pipe(
      debounceTime(300),
      map((res: any): Notificacao => res?.object)
    );
  }

  registar(nova: Partial<Notificacao>): Observable<Notificacao> {
    return this.httpApi.post(this.base, nova).pipe(
      debounceTime(300),
      map((res: any): Notificacao => res?.object)
    );
  }

  editar(item: Partial<Notificacao>, id: string | number): Observable<Notificacao> {
    return this.httpApi.put(`${this.base}/${id}`, item).pipe(
      debounceTime(300),
      map((res: any): Notificacao => res?.object)
    );
  }

  eliminar(item: any, id: string | number): Observable<Notificacao> {
    return this.httpApi.put(`${this.base}/eliminar/${id}`, item).pipe(
      debounceTime(300),
      map((res: any): Notificacao => res?.object)
    );
  }

  // ✅ Marcar como lida
  marcarComoLida(id: string): Observable<any> {
    return this.httpApi.put(`${this.base}/${id}/lida`, {}).pipe(
      debounceTime(300),
      map((res: any) => res)
    );
  }

  // 🔄 Lista paginada ou com filtros dinâmicos
  lista(options: any): Observable<Notificacao[]> {
    return this.httpApi.get(this.base, options).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map((res: any): Notificacao[] => res?.object ?? [])
    );
  }
}
