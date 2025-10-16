import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";
import { environment } from "@environments/environment";
import { Observable, debounceTime, map, repeat } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class DepartementoService extends BaseService {

    private base_url = `/api/v1/sigdoc/departamento`;

    constructor(httpApi: ApiService) {
        super(httpApi, '/sigdoc/departamento');

    }

    listarTodosRecebidos(options: any): Observable<any> {
        return this.httpApi
            .get(`${this.base_url}/enviado/depart`, options)
            .pipe(
                debounceTime(500),
                repeat(this.repeat_on),
                map((response: any): any => {
                    return response.object;
                })
            );
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

}   