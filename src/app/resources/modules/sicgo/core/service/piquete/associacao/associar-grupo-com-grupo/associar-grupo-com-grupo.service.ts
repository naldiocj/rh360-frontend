import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssociarGrupoComGrupoService {
  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/associar_grupo_grupo';

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

addGrupoGrupo(delituoso: FormData): Observable<any> {
  return this.httpApi.post(`${this.base}/associar`,delituoso );
}


  addGrupoToGrupos(
    gruposSelecionados: number[],
    grupo_id: number,
    grupoData: any
  ): Observable<any> {
    const url = `${this.base}/associar_grupos`; // Substitua pela rota correta da sua API
    const payload = {
      grupos_id: gruposSelecionados,
      grupo_id,
      ...grupoData,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.httpApi.post(url, payload);
  }

  removeGrupo(grupoIds: number[], grupo_id: number): Observable<any> {
    return this.httpApi.delete(`${this.base}/${grupo_id}/grupos`);
  }

  // addDelituososToOcorrencia(grupoIds: number[], grupo_id: number): Observable<any> {
  //   return this.httpApi.post(`${this.base}/grupos`, {
  //     grupoIds,
  //     grupo_id,
  //   });
  // }
}


