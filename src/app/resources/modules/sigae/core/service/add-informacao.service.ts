import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddInformacaoService {
  public api: string = "/api/v1/sigae";
  public base: string = `${this.api}/config/add-informacao`;

  constructor(private httpApi: ApiService) {}

  listar(options: any=null): Observable<any> {
    return this.httpApi.get(`${this.base}`,options).pipe(
      debounceTime(500),
      map((response: Object) => {
        return Object(response).object;
      })
    );
  }

  registar(options: any=null): Observable<any> {
    return this.httpApi.post(`${this.base}`,options).pipe(
      debounceTime(500),
      map((response: Object) => {
        return Object(response).object;
      })
    );
  }

  deletar( id:number): Observable<any> {
    return this.httpApi.delete(`${this.base}${id}}`).pipe(
      debounceTime(500),
      map((response: Object) => {
        return Object(response).object;
      })
    );
  }


  actualizar( id:number,item: any): Observable<any> {
    return this.httpApi.put(`${this.base}${id}}`,item).pipe(
      debounceTime(500),
      map((response: Object) => {
        return Object(response).object;
      })
    );
  }

  filtrar(): Observable<any> {
    return this.httpApi.get(`${this.base}`).pipe(
      debounceTime(500),
      map((response: Object) => {
        return Object(response).object;
      })
    );
  }
}
