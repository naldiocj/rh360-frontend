import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AgenteOrgaoService {
  public api: string = '/api/v1/sigae';
  public base: string = `${this.api}/agente-orgao`;

  constructor(private httpApi: ApiService) {}

  verAgenteOrgao(options: any = []): Observable<any> {
    if(options){
options = {
  perpage:5,
  orgaoId:323
}
    }
    return this.httpApi.get(`${this.base}`, options).pipe(
      debounceTime(500),
      map((response: Object) => {
        return Object(response).object;
      })
    );
  }

  TerAgenteOrgao(options: any = null): Observable<any> {
    let api: string = '/api/v1/sigpq';
    let base: string = `${api}/funcionarios`;

    return this.httpApi.get(`${base}`, options).pipe(
      debounceTime(500),
      map((response: Object) => {
        return Object(response).object;
      })
    );
  }

  GetCaminhoFile(options: any | string): Observable<any> {
    return this.httpApi.get(`${this.base}/getGuia`, options).pipe(
      debounceTime(500),
      map((response: Object) => {
        return Object(response).object;
      })
    );
  }
}
