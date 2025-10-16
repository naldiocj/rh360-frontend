import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";

@Injectable({
    providedIn: 'root',
})
export class EntradaExpedienteService extends BaseService {

    constructor(httpApi: ApiService) {
        super(httpApi, '/sigdoc/entrada-expediente'); //entrada-expediente //entrada-documento
    }
}   