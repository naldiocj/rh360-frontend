import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  public api: string = '/api/v1';
  public base: string = `${this.api}/portal-agente/agente`;
  constructor(private httApi: ApiService) {}

  public listar(agenteId: number): Observable<any> {
    return this.httApi.get(`${this.base}/${agenteId}/notificacoes`).pipe(
      debounceTime(500),
      map((response: Object) => {
        return Object(response).object;
      })
    );
  }

  public alerta(agenteId: number): Observable<any> {
    return this.httApi
      .get(`${this.base}/${agenteId}/notificacoes-nao-lida-aberta`)
      .pipe(
        debounceTime(500),
        map((response: Object) => {
          return Object(response).object;
        })
      );
  }

  public marcarLido(pessoaId: number, id: number): Observable<any> {
    return this.httApi.get(`${this.base}/${pessoaId}/lido/${id}`).pipe(
      debounceTime(500),
      map((response: Object) => {
        return Object(response).object;
      })
    );
  }

  public delete(pessoaId: number, id: number): Observable<any> {
    return this.httApi
      .delete(`${this.base}/${pessoaId}/remover/${id}`)
      .pipe(
        debounceTime(500),
        map((response: Object) => {
          return Object(response).object;
        })
      );
  }
}
