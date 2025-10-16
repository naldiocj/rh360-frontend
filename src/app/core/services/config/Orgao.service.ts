import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { debounceTime, map, Observable } from 'rxjs';
import { BaseService } from "../interfaces/BaseService.service";


@Injectable({
    providedIn: 'root',
})
export class OrgaoService  extends BaseService {

    constructor(httpApi: ApiService) {
        super(httpApi, '/sigpq/config/curso');
    }

    // listarU(options: any): Observable<any> {
    //     return this.httpApi
    //         .get(`${this.base}`, options)
    //         .pipe(
    //             debounceTime(500),
    //             map((response: Object): any => {
    //                 return Object(response).object;
    //             })
    //         )
    // }

}
 