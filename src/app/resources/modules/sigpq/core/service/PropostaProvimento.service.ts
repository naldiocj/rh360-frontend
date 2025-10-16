import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";
import { debounceTime, distinctUntilChanged, map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class PropostaProvimentoService extends BaseService {

    constructor(httpApi: ApiService) {
        super(httpApi, '/sigpq/proposta-provimentos');
    }

    listar_promocao_emTempo(options: any): Observable<any> {
        return this.httpApi
            .get(`${this.base}/em-tempo`, options)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    listarPorNumeroGuia(options: any) {
        return this.httpApi
            .get(`${this.base}/numero`, options)
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
            .get(`${this.base}/numero`, options)
            .pipe(
                distinctUntilChanged(),
                map((response: any): any => {
                    return response.object;
                })
            );
    }


}