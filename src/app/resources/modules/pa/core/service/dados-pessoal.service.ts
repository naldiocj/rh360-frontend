import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DadosPessoalService {

  public api: string = "/api/v1";
  public base: string = this.api + "/portal-agente/agente/dados-pessoais"
  constructor(private httpApi: ApiService) { }

  listar(options: any): Observable<any> {
    return this.httpApi
      .get(`${this.base}/${options.id}`, options)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object
        })
      )
  }
}
