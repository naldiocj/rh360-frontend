import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TratarEscalaService {

  public api: string = '/api/v1';
  public base: string = this.api + '/portal-agente/agente/tratar-escala-trabalho';

  constructor(private httpApi: ApiService) { }

  public cumprir(id: any): Observable<any> {
    return this.httpApi
      .put(`${this.base}/cumprir/${id}`)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      );
  }
  public naoCumprido(id: any): Observable<any> {
    return this.httpApi
      .put(`${this.base}/nao-cumprir/${id}`)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      );
  }


}
