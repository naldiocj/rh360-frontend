import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { debounceTime, map, Observable } from 'rxjs';
import { BaseService } from "../interfaces/BaseService.service";


@Injectable({
    providedIn: 'root',
})
export class ModuloService extends BaseService {

    constructor(httpApi: ApiService) {
        super(httpApi, '/config/modulos');
    }
}