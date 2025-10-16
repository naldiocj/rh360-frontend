import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';

import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AgenteReclamationService {
  public api: string = '/api/v1';
  public base: string = `${this.api}/portal-agente/agente`;

  constructor(private httpApi: ApiService) { }

  listar(agenteId: any, filtro: any): Observable<any> {
    return this.httpApi.get(`${this.base}/${agenteId}/reclamacoes`, filtro).pipe(
      debounceTime(500),
      map((response: Object) => {

        return Object(response).object;
      })
    );
  }

  registar(item: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('texto', item.texto);
    formData.append('estado', item.estado);
    formData.append('tem_documento', item.tem_documento);
    formData.append('nome_arquivo', item.nome_arquivo);
    formData.append('documento_file', item.documento_file);
    formData.append('pode_baixar', item.pode_baixar);
    formData.append('pessoafisica_id', item.pessoafisica_id);
    formData.append('modulo_id', item.modulo_id)
    formData.append('pessoajuridica_id', item.pessoajuridica_id)

    return this.httpApi.post(`${this.base}/reclamacoes`, formData).pipe(
      debounceTime(500),
      map((response: Object) => {
        return Object(response).object;
      })
    );
  }
  public listarUm(agenteId: any, id: number): Observable<any> {
    return this.httpApi
      .get(`${this.base}/${agenteId}/reclamacoes/${id}`)
      .pipe(
        debounceTime(500),
        map((response: Object) => {
          return Object(response).object;
        })
      );
  }
  public delete(agenteId: any, id: number): Observable<any> {
    return this.httpApi
      .delete(`${this.base}/${agenteId}/reclamacoes/${id}`)
      .pipe(
        debounceTime(500),
        map((response: Object) => {
          return Object(response).object;
        })
      );
  }
}
