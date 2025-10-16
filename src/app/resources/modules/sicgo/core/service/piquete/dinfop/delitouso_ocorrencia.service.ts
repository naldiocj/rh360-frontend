import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { BaseService } from '@core/services/interfaces/BaseService.service';
import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DinfopDelitousoOcorrenciaService {


  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/dinfop_delitouso_ocorrencia';

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
  registar(formData: FormData): Observable<any> {
    return this.httpApi.post(`${this.base}`, formData).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  editar(formulario: any, id: any): Observable<any> {
    return this.httpApi
      .put(`${this.base}/${id}`, formulario)
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

//Rota de associar grupos a uma ocorrenci
  addGrupoDelituoso(grupoIds: number[], ocorrenciaId: number): Observable<any> {
    return this.httpApi.post(`${this.base}/${grupoIds}/grupos`, { grupoIds,ocorrenciaId });
  }
  verGrupoDelituoso(id: number): Observable<any> {
    return this.httpApi.get(`${this.base}/${id}/grupo`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }
//Fim


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


