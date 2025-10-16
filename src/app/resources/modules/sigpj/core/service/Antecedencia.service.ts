import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { debounceTime, map, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class AntecedenciaService {

    public api: string = '/api/v1';
    public base: string = this.api + '/sigpj';

    constructor(private httpApi: ApiService) { }

    listarDisciplinar(  _id:number): Observable<any> {
        return this.httpApi
            .get(`${this.base}/disciplinar/antecedentes/${_id}`)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }
   
    listarReclamacao(id:number):Observable<any>{
        
        return this.httpApi
            .get(`${this.base}/reclamacao/antecedentes/${id}`)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )

    } 

}