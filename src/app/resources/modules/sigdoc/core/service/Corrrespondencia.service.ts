import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";
import { Observable, catchError, debounceTime, interval, map, of, switchMap } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class CorrespondenciaService extends BaseService {
    private base_url = `/api/v1/sigdoc/correspondencias`;

    constructor(httpApi: ApiService) {
        super(httpApi, '/sigdoc/correspondencias');
    }

    reencaminhar(formulario: any, id: any): Observable<any> {
        return this.httpApi
            .put(`${this.base_url}/${id}/reencaminhar`, formulario)
            .pipe(
                debounceTime(500),
                map((response: any): any => {
                    return response.object;
                })
            );
    }

    buscarUm(id: any): Observable<any> {
        return this.httpApi
            .get(`${this.base}/${id}`,)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

// Ajustado para o endpoint correto /listarNaoLidas
    public listarNaoLidas(options: any = null): Observable<any[]> {
        return this.httpApi.get(`${this.base_url}/listarNaoLidas`, { ...options }).pipe(
            debounceTime(500),
            map((response: any): any[] => {
                return response.data || response.object || []; // Ajuste para lidar com object do Postman
            }),
            catchError(() => of([]))
        );
    }

    // Método para marcar como lido
    public marcarComolido(correspondenciaId: number): Observable<any> {
        return this.httpApi.put(`${this.base_url}/${correspondenciaId}/marcarComolido`, {}).pipe(
            debounceTime(500),
            map((response: any): any => {
                return response.object || {};
            }),
            catchError(() => of({ error: 'Erro ao marcar como lida' }))
        );
    }

    public startPolling(options: any = null): Observable<any[]> {
        return interval(5000).pipe( // Intervalo mantido, mas sem debounce
            switchMap(() => this.listarNaoLidas(options))
        );
    }    

    // Método de polling para atualizar correspondências não lidas
    /*public startPolling(options: any = null): Observable<any[]> {
        return interval(10000).pipe(
            switchMap(() => this.listarNaoLidas(options))
        );
    }*/
}