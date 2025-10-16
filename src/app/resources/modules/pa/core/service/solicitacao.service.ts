import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { BaseService } from '@core/services/interfaces/BaseService.service';


@Injectable({
  providedIn: 'root',
})
export class SolicitacaoService  extends BaseService {


  constructor(httpApi: ApiService) {
    super(httpApi, '/pa/solicitacaos')
  }

  
  // public api: string = '/api/v1';
  // public base: string = this.api + '/portal-agente/agente';

  // constructor(private httpApi: ApiService) { }

  // listar(options: any, agente_id: number = 1): Observable<any> {
  //   console.log(options)
  //   return this.httpApi
  //     .get(`${this.base}/${agente_id}/solicitacoes`, options)
  //     .pipe(
  //       debounceTime(500),
  //       map((response: Object): any => {
  //         return Object(response).object;
  //       })
  //     );
  // }
  // calendario(agente_id: any, options: any): Observable<any> {
  //   return this.httpApi
  //     .get(`${this.base}/${agente_id}/calendario`, options)
  //     .pipe(
  //       debounceTime(500),
  //       map((response: Object): any => {
  //         return Object(response).object;
  //       })
  //     );
  // }

  // registar(agente_id: any, form: FormData): Observable<any> {

  //   return this.httpApi
  //     .post(`${this.base}/${agente_id}/solicitacoes`, form)
  //     .pipe(
  //       debounceTime(500),
  //       map((response: Object) => {
  //         return Object(response).object;
  //       })
  //     );
  // }
  // listarUm(id: any, agente_id: any = null): Observable<any> {
  //   return this.httpApi.get(`${this.base}/${agente_id}/solicitacoes/${id}`).pipe(
  //     debounceTime(500),
  //     map((response: Object): any => {
  //       return Object(response).object;
  //     })
  //   );
  // }

  // alterar(agente_id: any, args: any, id: any): Observable<any> {
  //   return this.httpApi
  //     .put(`${this.base}/${agente_id}/solicitacoes/${id}`, args)
  //     .pipe(
  //       debounceTime(500),
  //       map((response: Object) => {
  //         return Object(response).object;
  //       })
  //     );
  // }

  // eliminar(agente_id: any, id: any): Observable<any> {
  //   return this.httpApi
  //     .delete(`${this.base}/${agente_id}/solicitacoes/${id}`)
  //     .pipe(
  //       debounceTime(500),
  //       map((response: Object): any => {
  //         return Object(response).object;
  //       })
  //     );
  // }




}
