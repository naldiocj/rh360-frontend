import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { debounceTime, map, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class EstatisticasService {

    public api: string = '/api/v1/sigpq/';
    private composicaoEtaria:String="estatisticageral-mapa-composicaoetaria"
    private mapaPassividade:String="estatisticageral-mapapassividade-mensal"
    private mapaEfetividadeMensal:String="estatisticageral-mapaefetividade-mensal"
    private distribuicao_por_orgao:string="estatisticageral-distribuicao-por-orgao"
    private distribuicao_por_orgao_e_chefia:string="estatisticageral-distribuicao-cargo-chefia"
    private composicaosFormacao:string="estatisticageral-formacao-academica"
    constructor(private httpApi: ApiService) { }

    listar_orgaos_e_chefia(): Observable<any> {
        return this.httpApi
            .get(`${this.api+this.distribuicao_por_orgao_e_chefia}`)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    listar_todos_composicao_etaria(): Observable<any> {
      return this.httpApi
          .get(`${this.api+this.composicaoEtaria}`)
          .pipe(
              debounceTime(500),
              map((response: Object): any => {
                  return Object(response).object;
              })
          )
   }

   listar_todos_formacao_academica(): Observable<any> {
    return this.httpApi
        .get(`${this.api+this.composicaosFormacao}`)
        .pipe(
            debounceTime(500),
            map((response: Object): any => {
                return Object(response).object;
            })
        )
 }

    listar_todos_por_orgao(filtros:any): Observable<any> {
      return this.httpApi
          .get(`${this.api+this.distribuicao_por_orgao}`,filtros)
          .pipe(
              debounceTime(500),
              map((response: Object): any => {
                  return Object(response).object;
              })
          )
  }

    listar_todos_mapa_passividade(filtros:any): Observable<any> {
      return this.httpApi
          .get(`${this.api+this.mapaPassividade}`,filtros)
          .pipe(
              debounceTime(500),
              map((response: Object): any => {
                  return Object(response).object;
              })
          )
  }

  listar_todos_mapa_efetividade_mensal(filtros:any): Observable<any> {
    return this.httpApi
        .get(`${this.api+this.mapaEfetividadeMensal}`,filtros)
        .pipe(
            debounceTime(500),
            map((response: Object): any => {
                return Object(response).object;
            })
        )
}

}
