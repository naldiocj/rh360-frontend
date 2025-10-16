import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { BaseService } from '@core/services/interfaces/BaseService.service';
import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DinfopGrupoDelitousoService {


  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/dinfop_grupo';

  constructor(private httpApi: ApiService) {}

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
  registar(item: any): Observable<any> {
    return this.httpApi.post(`${this.base}`, item).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }
  ver(id: number): Observable<any> {
    return this.httpApi.get(`${this.base}/${id}`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
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


  
  addGrupo(delituosoIds: number[], grupoId: number): Observable<any> {
    return this.httpApi.post(`${this.base}/${grupoId}/delituosos`, { delituosoIds, grupoId });
  }

  removeGrupo(delituosoIds: number[], grupoId: number): Observable<any> {
    return this.httpApi.delete(`${this.base}/${grupoId}/delituosos`);
  }

  addDelituososToGrupos(delituosoIds: number[], grupoId: number): Observable<any> {
    return this.httpApi.post(`${this.base}/delituosos`, {
      delituosoIds,
      grupoId,
    });
  }
}


