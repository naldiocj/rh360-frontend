import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";
import { debounceTime, distinctUntilChanged, map, Observable, repeat, Subscription,Subject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class TipoLicencaParaFuncionarioService{

   public api: string = '/sigpq';
       public base: string = this.api + '/licencas-para-funcionario';
    constructor(private httpApi: ApiService,) {
    }

    listarUm(id: any): Observable<any> {
        return this.httpApi
          .get(`${this.base}/${id}`)
          .pipe(
            debounceTime(500),
            distinctUntilChanged(),
            map((response: any): any => {
              return response.object;
            })
          );
      }


      listar(options: any = null): Observable<any> {
        return this.httpApi
          .get(this.base, options)
          .pipe(
            debounceTime(500),
            map((response: any): any => {
              return response.object;
            })
          );
      }

      listarTodos(options: any): Observable<any> {
        return this.httpApi
          .get(this.base, options)
          .pipe(
            debounceTime(500),
            map((response: any): any => {
              return response.object;
            })
          );
      }

      listarTodosAnoMes(options: any): Observable<any> {
        return this.httpApi
          .get(`${this.base}/saber-dias-de-ferias-ano-mes`, options)
          .pipe(
            debounceTime(500),
            map((response: any): any => {
              return response.object;
            })
          );
      }

      registar(formulario: any): Observable<any> {
        return this.httpApi
          .post(this.base, formulario)
          .pipe(
            debounceTime(500),
            map((response: any): any => {
              return response.object;
            })
          );
      }

      editar(formulario: any, id: any): Observable<any> {
        return this.httpApi
          .put(`${this.base}/${id}`, formulario)
          .pipe(
            debounceTime(500),
            map((response: any): any => {
              return response.object;
            })
          );
      }
      enviar_detalhe_para_licenca_ano_mes(formulario: any): Observable<any> {
        return this.httpApi
          .put(`${this.base}/enviar_detalhe_para_licenca_ano_mes`, formulario)
          .pipe(
            debounceTime(500),
            map((response: any): any => {
              return response.object;
            })
          );
      }

      eliminar(id: any): Observable<any> {
        return this.httpApi
          .delete(`${this.base}/${id}`)
          .pipe(
            debounceTime(500),
            map((response: any): Object => {
              return Object(response).object;
            })
          );
      }


}
