import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { BaseService } from "@core/services/interfaces/BaseService.service";
import { debounceTime, map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class LicencaParaFuncionarioService extends BaseService {

    constructor(httpApi: ApiService) {
        super(httpApi, '/sigpq/licencas-para-funcionario');
    }

    alterarSituacao(formulario: any): Observable<any> {
      return this.httpApi
        .patch(`${this.base}`, formulario)
        .pipe(
          debounceTime(500),
          map((response: any): any => {
            return response.object;
          })
        );
    }

    listarTodasLicencas(options: any): Observable<any> {
      return this.httpApi
        .get(`${this.base}/listar-todas-tarefas`, options)
        .pipe(
          debounceTime(500),
          map((response: any): any => {
            return response.object;
          })
        );
    }

    listarTodasLicencasComPessoas(options: any): Observable<any> {
      return this.httpApi
        .get(`${this.base}/listar-todas-licencas`, options)
        .pipe(
          debounceTime(500),
          map((response: any): any => {
            return response.object;
          })
        );
    }

    saberDiasDeFerias(options: any): Observable<any> {
      return this.httpApi
        .get(`${this.base}/saber-dias-de-ferias`, options)
        .pipe(
          debounceTime(500),
          map((response: any): any => {
            return response.object;
          })
        );
    }
}
