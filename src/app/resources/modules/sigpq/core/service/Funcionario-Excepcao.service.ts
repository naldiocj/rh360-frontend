import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { BaseService } from '@core/services/interfaces/BaseService.service';
import { debounceTime, distinctUntilChanged, map, Observable, repeat } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioExcepcaoService extends BaseService {

  constructor(httpApi: ApiService) {
    super(httpApi, '/sigpq/excepto-funcionarios')
  }

  listarUmPorPessoa(id: any): Observable<any> {
    return this.httpApi
      .get(`${this.base}/emTempo/${id}`)
      .pipe(
        debounceTime(500),
        repeat(this.repeat_on),
        distinctUntilChanged(),
        map((response: any): any => {
          return response.object;
        })
      );
  }

}
