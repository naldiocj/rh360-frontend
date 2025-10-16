import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { debounceTime, map, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class PerfilService {

    public api: string = '/api/v1/sigpq/config';
    public base: string = this.api + '/perfil';

    constructor(private httpApi: ApiService) { }

    listar(options: any): Observable<any> {
        return this.httpApi
            .get(`${this.base}`, options)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }


    listarPorModulo(id: number): Observable<any> {
        return this.httpApi
            .get(`${this.base}/${id}/modulo`)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    registar(item: any): Observable<any> {
        return this.httpApi
            .post(`${this.base}`, item)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    editar(id: any, item: any): Observable<any> {
        return this.httpApi.patch(`${this.base}/${id}`, item).pipe(
            debounceTime(500),
            map((response: Object): any => {
                return Object(response).object
            })
        )
    }

}