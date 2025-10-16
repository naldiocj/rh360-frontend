import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';
// associar_delituoso_delituoso
@Injectable({
  providedIn: 'root'
})
export class AssociarDelituosoComDelituoService {
  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/associar_delituoso_delituoso';

  constructor(private httpApi: ApiService) {}


  ver(id: number): Observable<any> {
    return this.httpApi.get(`${this.base}/${id}`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }
  listar(): Observable<any> {
    return this.httpApi.get(`${this.base}`).pipe(
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

addDelituosoDelituoso(delituoso: FormData): Observable<any> {
  return this.httpApi.post(`${this.base}/associar`,delituoso );
}

  addDelituosoDelituososes(delituosoId: number[], delituoso_id: number, delituoso: FormData): Observable<any> {
    return this.httpApi.post(`${this.base}/${delituoso_id}/associar_delituosos`, {delituoso, delituosoId, delituoso_id });
  }

  addDelituosoDelituososs(payload: {
    delituosos_id: number[];
    delituoso_id: number;
    [key: string]: any;
  }): Observable<any> {
    const url = `${this.base}/associar_delituosos`; // Substitua pela rota correta da sua API

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.httpApi.post(url, payload);
  }

  removeDelituoso(delituosoIds: number[], delituoso_id: number): Observable<any> {
    return this.httpApi.delete(`${this.base}/${delituoso_id}/delituosos`);
  }

  addDelituososToOcorrencia(delituosoIds: number[], delituoso_id: number): Observable<any> {
    return this.httpApi.post(`${this.base}/delituosos`, {
      delituosoIds,
      delituoso_id,
    });
  }
}


