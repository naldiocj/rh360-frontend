import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';

import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentoService {

  public api: string = '/api/v1/sigdoc';
  public base: string = this.api + '/config/entrada_expediente';

  constructor(private httpApi: ApiService) {}

  listarTodos(options: any): Observable<any> {
    return this.httpApi.get(`${this.base}`, options).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }
  
  listarUm(id: any): Observable<any> {
    return this.httpApi.get(`${this.base}/${id}`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }
  
  deletar(id: any): Observable<any> {
    return this.httpApi.delete(`${this.base}/${id}`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  listar(options: any): Observable<any> {
    return this.httpApi.get(`${this.base}`, options).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }
  registar(item: any): Observable<any> {
    return this.httpApi.post(`${this.base}`, item).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }
  editar(id: any, item: any): Observable<any> {
    return this.httpApi.put(`${this.base}/${id}`, item).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }
}
