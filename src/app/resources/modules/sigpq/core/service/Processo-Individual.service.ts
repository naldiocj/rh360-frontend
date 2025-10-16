import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";
import { debounceTime, map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class ProcessoIndividualService extends BaseService {

    constructor(httpApi: ApiService) {
        super(httpApi, '/sigpq/processos-individual');
    }

    activo(formulario: any, id: any): Observable<any> {
          return this.httpApi
            .put(`${this.base}/activo/${id}`, formulario)
            .pipe(
              debounceTime(500),
      
              map((response: any): any => {
                return response.object;
              })
            );
        }

}