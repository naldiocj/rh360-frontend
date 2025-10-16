import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { debounceTime, map, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class ParecerReclamacaoService {

    public api: string = '/api/v1';
    public base: string = this.api + '/sigpj/reclamacao/parecer';

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

    listarPecas(options: any, id:any): Observable<any> {
        return this.httpApi
            .get(`${this.base}/pecas/${id}`, options)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    
    listarTotal( ): Observable<any> {
        return this.httpApi
            .get(`${this.base}/total`)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    registar(item: any): Observable<any> {
        console.log(item);
        
        return this.httpApi
            .post(`${this.base}`, item)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }
    eliminar( id:any ): Observable<any> {
        return this.httpApi
            .put(`${this.base}/${id}`)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    verUm(id:any): Observable<any> {
        return this.httpApi
            .get(`${this.base}/${id}`)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

}