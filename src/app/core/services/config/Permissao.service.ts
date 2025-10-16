import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "../interfaces/BaseService.service";
import { Observable, debounceTime, map } from "rxjs";


@Injectable({
    providedIn: 'root',
})
export class PermissaoService extends BaseService {

    constructor(httpApi: ApiService) {
        super(httpApi, '/permissions')
    }

    toggleActivo(id: any): Observable<any> {
        return this.httpApi.put(`${this.base}/${id}/toggle-activo`).pipe(
            debounceTime(500),
            map((response: Object): any => {
                return Object(response).object
            })
        )
    }

}