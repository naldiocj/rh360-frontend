import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";

@Injectable({
    providedIn: 'root',
})
export class ActoNomeacaoService  extends BaseService {

    constructor(http:ApiService){
        super(http, '/sigpq/config/acto-nomeacaos')
    }

    // public api: string = '/api/v1';
    // public base: string = this.api + '/sigpq/config/acto-nomeacao';

    // constructor(private httpApi: ApiService) { }

    // listar(options: any): Observable<any> {
    //     return this.httpApi
    //         .get(`${this.base}`, options)
    //         .pipe(
    //             debounceTime(500),
    //             map((response: Object): any => {
    //                 return Object(response).object;
    //             })
    //         )
    // }

    // registar(item: any): Observable<any> {
    //     // console.log(item);

    //     return this.httpApi
    //         .post(`${this.base}`, item)
    //         .pipe(
    //             debounceTime(500),
    //             map((response: Object): any => {
    //                 return Object(response).object;
    //             })
    //         )
    // }

}