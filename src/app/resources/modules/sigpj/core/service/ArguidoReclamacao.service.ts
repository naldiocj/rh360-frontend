import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { debounceTime, map, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class ArguidoReclamacaoService {

    public api: string = '/api/v1';
    public base: string = this.api + '/sigpj/reclamacao';

    constructor(private httpApi: ApiService) { }

    listar( options: any, _id:number): Observable<any> {
        return this.httpApi
            .get(`${this.base}/todos-arguidos/${_id}`, options)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }
    eliminar( id:number ): Observable<any> {
        return this.httpApi
            .put(`${this.base}/todos-arguidos/${id}`)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }
   
    editar( item: any, id: number ): Observable<any> {
        return this.httpApi
            .put(`${this.base}/todos-arguidos/${id}`, item)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    verUm(id:any): Observable<any> {
        return this.httpApi
            .get(`${this.base}/arguidos/${id}`)
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
            .post(`${this.base}/todos-arguidos`, item)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    verAdicionado(id:number, options:any):Observable<any>{
        
        return this.httpApi
            .get(`${this.base}/adicionado/${id}`, options)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )

    }

}