import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { debounceTime, map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ProvimentoService {

  public api: string = '/api/v1/sigpq/provimento';
  // public base: string = this.api + '/perfil';

  constructor(private httpApi: ApiService) { }

  listar_promocao_emTempo(options: any): Observable<any> {
    return this.httpApi
      .get(`${this.api}/em-tempo`, options)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
  }
  listarUmPorOrdem(filtro: any): Observable<any> {
    return this.httpApi
      .get(`${this.api}/por-ordem`, filtro)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
  }



  listarHistorico(pessoaId: number, filtro: any): Observable<any> {
    return this.httpApi
      .get(`${this.api}/historico/${pessoaId}`, filtro)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
  }
  listarTodos(options: any): Observable<any> {
    return this.httpApi
      .get(`${this.api}`, options)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
  }

  listarPorPessoa(pessoaId: number): Observable<any> {
    return this.httpApi.get(`${this.api}/em-tempo/${pessoaId}`).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object
      })
    )
  }
  registar(item: any): Observable<any> {
    return this.httpApi
      .post2(`${this.api}`, item)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
  }
  editar(id: any, item: any): Observable<any> {
    return this.httpApi
      .put2(`${this.api}/${id}`, item)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
  }
  atualizar_data_provimento(id: any, item: any): Observable<any> {
    return this.httpApi
      .put2(`${this.api}/atualizar-data-provimento/${id}`, item)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
  }

}
