import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { debounceTime, map, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class QueixaService {

    public api: string = '/api/v1';
    public base: string = this.api + '/sigiac/queixa';
    //fiz um novo pull e vou fazer o push
    constructor(private httpApi: ApiService) { }

    

    registrar(item:any):Observable<any>{

        return this.httpApi
            .post(`${this.base}`, item)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                }) 
            )

    }

    registarAcusado(item:any):Observable<any>{

        return this.httpApi
            .post(`${this.base}`, item) 
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                }) 
            )

    }


    listarTodos(options:any):Observable<any>{ 

      //return Object([]).object;
        return this.httpApi 
            .get(`${this.base}`, options)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                }) 
            )  

    }

    verQueixoso(id:any):Observable<any>{

        return this.httpApi
            .get(`${this.base}/${id}`)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
 
    }  

    listarUm(id:any):Observable<any>{

        return this.httpApi
        .get(`${this.base}/${id}`)
        .pipe(
            debounceTime(500),
            map((response: Object): any => {
                return Object(response).object;
            })
        )
    }


    verDespacho(id:any):Observable<any>{

        return this.httpApi
            .get(`${this.base}/despacho/${id}`)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )

    }

    editarDesp(item:any, id:number):Observable<any>{

        return this.httpApi
            .put(`${this.base}/despacho/${id}`, item)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )

    }


    registDesp(item:any):Observable<any>{

        return this.httpApi
            .post(`${this.base}/despacho`, item)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )

    }

}
