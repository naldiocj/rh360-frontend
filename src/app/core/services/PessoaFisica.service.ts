import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";
import { Observable, debounceTime, map } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class PessoaFisicaService extends BaseService {

    constructor(httpApi: ApiService) {
        super(httpApi, '/sigpq/pessoaFisica/estados');
    }

    listarEstados(options: any): Observable<any> {
        return this.httpApi
            .get(`${this.base}`, options)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }
}   