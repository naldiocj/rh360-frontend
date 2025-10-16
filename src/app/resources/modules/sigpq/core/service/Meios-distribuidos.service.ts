import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";
import { debounceTime, map, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class MeiosDistribuidosService 
{

// extends BaseService 

//     constructor(httpApi: ApiService) {
//       super(httpApi, '/funcionarios/meios-policiais')
//     }

    public api: string = '/api/v1/sigpq';
    public base: string = this.api + '/funcionarios/meios-policiais';

    constructor(private httpApi: ApiService) { }

    listarMeiosDistribuidos(pessoaId: number, filtro: any): Observable<any> {
        return this.httpApi
            .get(`${this.base}/${pessoaId}`, filtro)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

}