import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssociarGrupoOcorrenciaService {

  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/associar_grupo_ocorrencia';


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

  removeDelituoso(grupoIds: number[], ocorrenciaId: number): Observable<any> {
    return this.httpApi.delete(`${this.base}/${grupoIds}/grupos`);
  }

//Fim
}


