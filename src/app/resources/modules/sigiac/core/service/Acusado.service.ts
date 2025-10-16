import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { debounceTime, map, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class AcusadoService {

    public api: string = '/api/v1';
    public base: string = this.api + '/sigiac/queixa/acusado';

    constructor(private httpApi: ApiService) { }

    listar( options: any, queixosoId:any): Observable<any> {
        return this.httpApi
            .get(`${this.base}/porQueixoso/${queixosoId}`, options)
            .pipe(
                debounceTime(500),
                map((response: Object): any => { 
                    return Object(response).object;
                })
            )
    }
    eliminar( id:number ): Observable<any> {
        return this.httpApi
            .get(`${this.base}/eliminar/${id}`)
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

    registarAcusado(item:any):Observable<any>{
        return this.httpApi
            .post(`${this.base}`, item) 
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;

                }) 
            )
            $("#btn-processando").hide();

    }

  

}