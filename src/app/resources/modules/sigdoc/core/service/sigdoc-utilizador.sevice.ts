import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";
import { environment } from "@environments/environment";
import { Observable, debounceTime, map } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class SigdocUtilizadorService extends BaseService {

  

    private base_url = `/api/v1/sigdoc/utilizador`;

    constructor(httpApi: ApiService) {
        super(httpApi, '/sigdoc/utilizador');

    }


    /*listarUsuarios(formulario: any): Observable<any> {
        return this.httpApi
            .get(`${this.base_url}/listarusuarios`, formulario)
            .pipe(
                debounceTime(500),
                map((response: any): any => {
                    return response.object;
                })
            );
    }*/

    listarusuarios(options: any): Observable<any> {
      return this.httpApi.get(`${this.base}/listarusuarios`, options).pipe(
        debounceTime(500),
        
        map((response: Object): any => {
          return Object(response).object;
        })
      );
    }
  
    
}  

//SigdocUtilizadorService
