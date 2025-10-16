import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";

@Injectable({
    providedIn: 'root',
})
export class TipoNaturezaService extends BaseService {

    constructor(httpApi: ApiService) {
        super(httpApi, '/sigdoc/config/tipo-natureza');
    }
   

}