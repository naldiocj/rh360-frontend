import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { debounceTime, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatenteService {
  public api: string = '/api/v1';
  public base: string = this.api + '/patente';

  constructor(private httpApi: ApiService) {}

  listar(options: any): Observable<any> {
    return this.httpApi.get(`${this.base}`, options).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
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

  editar(formulario: any, id: any): Observable<any> {
    return this.httpApi.put(`${this.base}/${id}`, formulario).pipe(
      debounceTime(500),
      map((response: any): any => {
        return response.object;
      })
    );
  }

  eliminar(id: any): Observable<any> {
    return this.httpApi.delete(`${this.base}/${id}`).pipe(
      debounceTime(500),
      map((response: any): Object => {
        return Object(response).object;
      })
    );
  }
}
