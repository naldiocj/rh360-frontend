import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";
import { Observable, debounceTime, map } from "rxjs";

interface ContagemRegistrosResponse {
    total: number;
  }

@Injectable({
    providedIn: 'root',
})
export class DashboardService extends BaseService {

    private base_url = `/api/v1/sigdoc/dashboards`;

    constructor(httpApi: ApiService) {
        super(httpApi, '/sigdoc/dashboards');
    }

    entradaDocumentos(options: any): Observable<number> {
        return this.httpApi
            .get(`${this.base_url}/documento-entrada`, options)
            .pipe(
                debounceTime(500),
                map((response: ContagemRegistrosResponse): number => {
                    return response.total;
                })
            );
    }

    documentoTramitadoRecebido(options: any): Observable<number> {
        return this.httpApi
            .get(`${this.base_url}/documento-tramitado-recebido`, options)
            .pipe(
                debounceTime(500),
                map((response: ContagemRegistrosResponse): number => {
                    return response.total;
                })
            );
    }

    documentoTramitadoRecebidoPendente(options: any): Observable<number> {
        return this.httpApi
            .get(`${this.base_url}/documento-tramitado-recebidopendente`, options)
            .pipe(
                debounceTime(500),
                map((response: ContagemRegistrosResponse): number => {
                    return response.total;
                })
            );
    }

    arquivosdigitais(options: any): Observable<number> {
        return this.httpApi
            .get(`${this.base_url}/arquivos-ditais`, options)
            .pipe(
                debounceTime(500),
                map((response: ContagemRegistrosResponse): number => {
                    return response.total;
                })
            );
    }
    
    criardocumnetos(options: any): Observable<number> {
        return this.httpApi
            .get(`${this.base_url}/criar-documentos`, options)
            .pipe(
                debounceTime(500),
                map((response: ContagemRegistrosResponse): number => {
                    return response.total;
                })
            );
    }
}   