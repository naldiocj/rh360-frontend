import { Inject, Injectable, OnDestroy } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { environment } from "@environments/environment";
import { debounceTime, distinctUntilChanged, map, Observable, repeat, Subscription } from 'rxjs';

import InterfaceService from "@core/services/interfaces/Interface.service";

@Injectable({
  providedIn: 'root',
})
export class BaseService implements InterfaceService, OnDestroy {

  private sub!: Subscription;
  public base: string = "";
  protected repeat_on:number=1
  constructor(
    public httpApi: ApiService,
    @Inject('BASE_URL') public url: string
  ) {
    this.base = `${environment.api_url_by_version}${this.url}`;
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
      .post2(this.base, formulario)
      .pipe(
        debounceTime(500),
        map((response: any): any => {
          return response.object;
        })
      );
  }

  editar(formulario: any, id: any): Observable<any> {
    return this.httpApi
      .put2(`${this.base}/${id}`, formulario)
      .pipe(
        debounceTime(500),

        map((response: any): any => {
          return response.object;
        })
      );
  }
  enviar_detalhe_para_licenca_ano_mes(formulario: any): Observable<any> {
    return this.httpApi
      .put2(`${this.base}/enviar_detalhe_para_licenca_ano_mes`, formulario)
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

  ngOnDestroy() {
    this.sub!.unsubscribe();
  }
}
