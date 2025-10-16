import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { debounceTime, map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ArguidoDisciplinarService {

  public api: string = '/api/v1';
  public base: string = this.api + '/sigpj/disciplinar-arguidos';

  constructor(private httpApi: ApiService) { }

  listarTodos(options: any): Observable<any> {
    return this.httpApi
      .get(`${this.base}/`, options)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
  }

  // verAdicionado(id:number, options:any):Observable<any>{

  //     return this.httpApi
  //         .get(`${this.base}/adicionado/${id}`, options)
  //         .pipe(
  //             debounceTime(500),
  //             map((response: Object): any => {
  //                 return Object(response).object;
  //             })
  //         )

  // }

  listarUm(id: number): Observable<any> {
    return this.httpApi
      .get(`${this.base}/${id}`)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
  }

  registar(item: any): Observable<any> {
    return this.httpApi
      .post(`${this.base}/`, item)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
  }

  registarIntervenientes(item: any): Observable<any> {
    return this.httpApi
      .post(`${this.base}/intervenientes`, item)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
  }

  // eliminar( id:number ): Observable<any> {
  //     return this.httpApi
  //         .put(`${this.base}/todos-arguidos/${id}`)
  //         .pipe(
  //             debounceTime(500),
  //             map((response: Object): any => {
  //                 return Object(response).object;
  //             })
  //         )
  // }

}
