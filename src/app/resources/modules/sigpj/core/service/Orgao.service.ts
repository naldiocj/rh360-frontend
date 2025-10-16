import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { debounceTime, map, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class OrgaoService {

    public api: string = '/api/v1';
    public base: string = this.api + '/sigpj/disciplinar/orgaos';

    constructor(private httpApi: ApiService) { }

    listar( ): Observable<any> {
        return this.httpApi
            .get(`${this.base}`)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }
     

}