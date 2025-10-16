import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { Observable, debounceTime, map } from "rxjs";


@Injectable
  ({
    providedIn: 'root'
  })
export class ObjectoCrimeService{

  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/config/objecto-crimes';

  constructor(private httpApi: ApiService) {}

  listars(): Observable<any> {
    return this.httpApi.get(`${this.base}`).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }
  listar(options: any): Observable<any> {
    return this.httpApi.get(`${this.base}`, options).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
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
  registar(item: any): Observable<any> {
    return this.httpApi.post(`${this.base}`, item).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }
}

