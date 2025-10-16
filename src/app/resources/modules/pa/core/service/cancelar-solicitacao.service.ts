import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CancelarSolicitacaoService {
  public api: string = '/api/v1';
  public base: string = this.api + '/portal-agente/agente';

  constructor(private httpApi: ApiService) {}

  public listar(agenteId: any, options: any): Observable<any> {
    return this.httpApi
      .get(`${this.base}/${agenteId}/cancelar-solicitacao`, options)
      .pipe(
        debounceTime(500),
        map((response: Object) => {
          return Object(response).object;
        })
      );
  }
  public registar(agenteId: any, items: any): Observable<any> {
    return this.httpApi
      .post(`${this.base}/${agenteId}/cancelar-solicitacao`, items)
      .pipe(
        debounceTime(500),
        map((response: Object) => {
          return Object(response).object;
        })
      );
  }
  public listarUm(agenteId: any, id: any): Observable<any> {
    return this.httpApi
      .get(`${this.base}/${agenteId}/cancelar-solicitacao/${id}`)
      .pipe(
        debounceTime(500),
        map((response: Object) => {
          return Object(response).object;
        })
      );
  }
  public eliminar(agenteId: any, id: any): Observable<any> {
    return this.httpApi
      .delete(`${this.base}/${agenteId}/cancelar-solicitacao/${id}`)
      .pipe(
        debounceTime(500),
        map((response: Object) => {
          return Object(response).object;
        })
      );
  }
  public actualizar(agenteId: any, id: any, items: any): Observable<any> {
    return this.httpApi
      .put(`${this.base}/${agenteId}/cancelar-solicitacao/${id}`, items)
      .pipe(
        debounceTime(500),
        map((response: Object) => {
          return Object(response).object;
        })
      );
  }
}
