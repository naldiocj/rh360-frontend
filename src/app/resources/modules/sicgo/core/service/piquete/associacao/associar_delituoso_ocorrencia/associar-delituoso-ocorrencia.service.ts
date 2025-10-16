import { Injectable } from '@angular/core'; 
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssociarDelituosoOcorrenciaService {

  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/associar_delituoso_ocorrencia';

  constructor(private httpApi: ApiService) {}


  ver(id: number): Observable<any> {
    return this.httpApi.get(`${this.base}/${id}`).pipe(
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

  addDelituoso(delituosoId: number[], ocorrenciaId: number): Observable<any> {
    return this.httpApi.post(`${this.base}/${delituosoId}/delituosos`, { delituosoId,ocorrenciaId });
  }

  removeDelituoso(delituosoIds: number[], ocorrenciaId: number): Observable<any> {
    return this.httpApi.delete(`${this.base}/${ocorrenciaId}/delituosos`);
  }

  addDelituososToOcorrencia(delituosoIds: number[], ocorrenciaId: number): Observable<any> {
    return this.httpApi.post(`${this.base}/delituosos`, {
      delituosoIds,
      ocorrenciaId,
    });
  }
}


