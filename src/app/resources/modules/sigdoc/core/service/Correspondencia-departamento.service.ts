import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";
import { environment } from "@environments/environment";
import { Observable, debounceTime, map } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class CorrespondenciaDepartamentoService extends BaseService {

  

    private base_url = `/api/v1/sigdoc/correspondencia-departamento`;

    constructor(httpApi: ApiService) {
        super(httpApi, '/sigdoc/correspondencia-departamento');

    }


    reencaminhar(formulario: any, id: any): Observable<any> {
        return this.httpApi
            .put(`${this.base_url}/${id}/reencaminhar`, formulario)
            .pipe(
                debounceTime(500),
                map((response: any): any => {
                    return response.object;
                })
            );
    }

}   