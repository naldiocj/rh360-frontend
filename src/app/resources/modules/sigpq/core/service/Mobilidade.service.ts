import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";
import { debounceTime, distinctUntilChanged, map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class MobilidadeService extends BaseService {

    constructor(httpApi: ApiService) {
        super(httpApi, '/sigpq/mobilidade');
    }

    atualizar_data_mobilidade(formulario: any, id: any): Observable<any> {
            return this.httpApi
              .put(`${this.base}/editarData/${id}`, formulario)
              .pipe(
                debounceTime(500),
                map((response: any): any => {
                  return response.object;
                })
              );
          }

    pdfIndividual() { }
    pdfEmGrupo(numero_guia: any) {
        return this.httpApi
            .get(`${this.base}/pdf/${numero_guia}`)
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                map((response: any): any => {
                    return response;
                })
            );
    }

    listarPorNumeroGuia(options: any) {
        return this.httpApi
            .get(`${this.base}/guia`, options)
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                map((response: any): any => {
                    return response.object;
                })
            );
    }

    listarPorPessoa(options: any) {
        return this.httpApi
            .get(`${this.base}/por-pessoa`, options)
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                map((response: any): any => {
                    return response.object;
                })
            );
    }

    listarPorGuia(options: any) {
        return this.httpApi
            .get(`${this.base}/por-guia`, options)
            .pipe(
                distinctUntilChanged(),
                map((response: any): any => {
                    return response.object;
                })
            );
    }

}
