import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import InterfaceService from "@core/services/interfaces/Interface.service";
import { environment } from "@environments/environment";
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class EspecialistaService implements InterfaceService {
 
    public base: string = environment.api_url_by_version + '/sigpq/config/especialista';

    constructor(private httpApi: ApiService) { }

    listarUm(id: any): Observable<any> { 
        return this.httpApi
            .get(`${this.base}/${id}`)
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    listarTodos(filtro: any): Observable<any> {
        return this.httpApi
            .get(`${this.base}`, filtro)
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }
 
    registar(formulario: any): Observable<any> {
        return this.httpApi
            .get(`${this.base}`, formulario)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    editar(formulario: any, id: any): Observable<any> {
        return this.httpApi
            .get(`${this.base}/${id}`, formulario)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    eliminar(id: any): Observable<any> {
        return this.httpApi
            .delete(`${this.base}/${id}`,)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

}