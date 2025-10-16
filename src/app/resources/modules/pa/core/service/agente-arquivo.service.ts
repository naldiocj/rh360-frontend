import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AgenteArquivoService {
  public api: string = '/api/v1';
  public base: string = `${this.api}/portal-agente/agente`;
  constructor(private httpApi: ApiService) {}

  public listar(pessoaId: any, options: any): Observable<any> {
    return this.httpApi.get(`${this.base}/${pessoaId}/arquivos`, options).pipe(
      debounceTime(500),
      map((response: Object) => {
        return Object(response).object;
      })
    );
  }

  public registar(item: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('arquivo', item.arquivo);
    formData.append('descricao', item.descricao);
    formData.append('pode_baixar', item.pode_baixar);
    formData.append('pessoafisica_id', item.pessoafisica_id)
    formData.append('tipo', item.tipo)

    return this.httpApi
      .post(`${this.base}/arquivos`, formData)
      .pipe(
        debounceTime(500),
        map((response: Object) => {
          return Object(response).object;
        })
      );
  }

  public delete(pessoaId: any, id: number): Observable<any> {
    return this.httpApi.delete(`${this.base}/${pessoaId}/arquivos/${id}`);
  }
}
