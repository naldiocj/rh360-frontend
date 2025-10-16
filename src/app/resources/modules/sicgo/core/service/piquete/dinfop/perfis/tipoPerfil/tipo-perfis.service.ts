import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoPerfisService {


    public api: string = '/api/v1/sicgo';
    public base: string = this.api + '/tipo_perfis';

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