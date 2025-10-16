import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";
import { debounceTime, map, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class TipoCorrespondenciaService extends BaseService {

    constructor(httpApi: ApiService) {
        super(httpApi, '/sigdoc/config/tipo-documento');
    }
   
    

}