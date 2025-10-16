import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OcorrenciaEmService{

  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/ocorrencia-emergencias';
  constructor(private httpApi: ApiService) {}


  registar(item: any): Observable<any> {
    return this.httpApi.post(`${this.base}`, item).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }


}
