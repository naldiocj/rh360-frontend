import { Observable, debounceTime, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';

@Injectable({
  providedIn: 'root'
})
export class EscalaTrabalhaService {

  public api: string = '/api/v1';
  public base: string = this.api+'/portal-agente/agente/trabalho/escala-trabalho';

  constructor(private httpApi: ApiService) { }

  public listar(options: any): Observable<any> {
    return this.httpApi
      .get(`${this.base}`, options)
      .pipe(
        debounceTime(500),
        map((response: Object) => {
          return Object(response).object;
        })
      );
  }
  public registar(item: any): Observable<any> {
    return this.httpApi
      .post(`${this.base}`, item)
      .pipe(
        debounceTime(500),
        map((response: Object) => {
          return Object(response).object;
        })
      );
  }
  public listarUm(id: any): Observable<any> {
    return this.httpApi
      .get(`${this.base}/${id}`)
      .pipe(
        debounceTime(500),
        map((response: Object) => {
          return Object(response).object;
        })
      );
  }
  public eliminar(id: any): Observable<any> {
    return this.httpApi
      .delete(`${this.base}/${id}`)
      .pipe(
        debounceTime(500),
        map((response: Object) => {
          return Object(response).object;
        })
      );
  }
  public editar(id: any, item: any): Observable<any> {
    return this.httpApi
      .put(`${this.base}/${id}`, item)
      .pipe(
        debounceTime(500),
        map((response: Object) => {
          return Object(response).object;
        })
      );
  }
}
