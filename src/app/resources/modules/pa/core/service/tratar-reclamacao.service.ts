import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TratarReclamacaoService {

  public api: string = '/api/v1';
  public base: string = this.api + '/portal-agente/agente/reclamacao';

  constructor(private httpApi: ApiService) { }

  public aprovar(id: any): Observable<any> {
    return this.httpApi
      .put(`${this.base}/${id}/aprovar`)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      );
  }
  public reprovar(id: any): Observable<any> {
    return this.httpApi
      .put(`${this.base}/${id}/reprovar`)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      );
  }

  public pendente(id: any): Observable<any> {
    return this.httpApi
      .put(`${this.base}/${id}/pendente`,)
      .pipe(
        debounceTime(500),
        map((response: Object) => {
          return Object(response).object;
        })
      );
  }
}
