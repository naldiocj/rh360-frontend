import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";
import { debounceTime, map, Observable, repeat } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class CargosService extends BaseService {

    constructor(httpApi: ApiService) {
        super(httpApi, '/sigpq/cargos');
    }

    atualizar_data_cargo(formulario: any, id: any): Observable<any> {
        return this.httpApi
          .put2(`${this.base}/editarData/${id}`, formulario)
          .pipe(
            debounceTime(500),
            map((response: any): any => {
              return response.object;
            })
          );
      }
}
