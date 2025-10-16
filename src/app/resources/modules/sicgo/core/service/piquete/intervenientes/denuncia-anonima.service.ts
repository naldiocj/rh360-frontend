import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DenunciaAnonimaService {
public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/denuncia-anonima';
  constructor(private httpApi: ApiService) {}

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
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }


  editar(item: any, id: number): Observable<any> {
    return this.httpApi.put(`${this.base}/${id}`, item).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  eliminar(item: any, id: number): Observable<any> {
    return this.httpApi.put(`${this.base}/eliminar/${id}`, item).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  ver(id: string|number): Observable<any> {
    return this.httpApi.get(`${this.base}/${id}`).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

}
