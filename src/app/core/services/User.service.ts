import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { debounceTime, map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    public api: string = '/api/v1';
    public base: string = this.api + '/users';

    constructor(private httpApi: ApiService) { }

    listar(options: any = {}): Observable<any> {
        return this.httpApi
            .get(`${this.base}`, options)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    buscarPorId(id: number): Observable<any> {
        return this.httpApi
            .get(`${this.base}/${id}`)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    criar(item: any): Observable<any> {
        return this.httpApi
            .post(`${this.base}`, item)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    atualizar(id: number, item: any): Observable<any> {
        return this.httpApi
            .put(`${this.base}/${id}`, item)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    remover(id: number): Observable<any> {
        return this.httpApi
            .delete(`${this.base}/${id}`)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }
} 