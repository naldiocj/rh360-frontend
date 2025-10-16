import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";

@Injectable({
    providedIn: 'root',
})
export class TipicidadeService extends BaseService {

    constructor(httpApi: ApiService) {
        super(httpApi, '/config/tipicidade_sigdoc');
    }
}