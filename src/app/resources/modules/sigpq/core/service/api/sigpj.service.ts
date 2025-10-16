import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";
import { debounceTime, map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class SigpjApiService {

  public api: string = '/api/v1/sigpj';

  constructor(private httpApi: ApiService) { }

  listarSituacaoDisciplinarAgentes(options: any): Observable<any> {
    return this.httpApi
      .get(`${this.api}/disciplinar/api/listar-situacao-disciplinar-agentes`, options)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
  }
}
