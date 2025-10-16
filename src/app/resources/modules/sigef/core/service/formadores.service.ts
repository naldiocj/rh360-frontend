import { Injectable } from '@angular/core';
import { debounceTime, map, Observable } from 'rxjs';

import { ApiService } from '@core/providers/http/api.service';

@Injectable({
  providedIn: 'root',
})
export class FormadoresService {
  public api: string = '/api/v1';
  public base: string = this.api + '/sigef/formadores';

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

  eliminar(item: any, id: number): Observable<any> {
    return this.httpApi.put(`${this.base}/eliminar/${id}`, item).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  actualizar(id: any, item: any): Observable<any> {
    return this.httpApi.put(`${this.base}/${id}`, item).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }
}
