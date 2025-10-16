// src/app/resources/modules/sigdoc/core/service/notificacoes.service.ts
import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { BaseService } from '@core/services/interfaces/BaseService.service';
import { Observable, interval, switchMap, catchError, of, debounceTime, map } from 'rxjs';

export interface Notificacao {
  id: number;
  mensagem: string;
  remetente_sigla: string;
  remetente: string;
  lido: boolean;
  correspondencia_id?: number;
  created_at: string;
  pessoa_juridica_id?: number; // Adicionado para consistência com o backend
  remetente_id?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificacoesService extends BaseService {
  private base_url = `/api/v1/sigdoc/notificacoes`;

  constructor(httpApi: ApiService) {
    super(httpApi, '/sigdoc/notificacoes');
  }

  public mostarNotificacao(options: any = null): Observable<Notificacao[]> {
    return this.httpApi.get(this.base_url, options).pipe(
      debounceTime(500),
      map((response: any): Notificacao[] => {
        return response.object || [];
      }),
      catchError(() => of([]))
    );
  }

  public marcarComolido(notificationId: number): Observable<any> {
    return this.httpApi.put(`${this.base_url}/${notificationId}`, {}).pipe(
      debounceTime(500),
      map((response: any): any => {
        return response.object || {};
      }),
      catchError(() => of({ error: 'Erro ao marcar como lida' }))
    );
  }

  public startPolling(options: any = null): Observable<Notificacao[]> {
    return interval(10000).pipe(
      switchMap(() => this.mostarNotificacao(options))
    );
  }
}