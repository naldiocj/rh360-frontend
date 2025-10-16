import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service"; 
import { BaseService } from "../interfaces/BaseService.service";

@Injectable({
    providedIn: 'root',
})
export class TipoEstruturaOrganica extends BaseService {

    constructor(httpApi: ApiService) {
        super(httpApi, '/config/estrutura-organicas');
    }
}