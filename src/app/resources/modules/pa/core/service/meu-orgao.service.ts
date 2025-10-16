import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';

import { Observable, debounceTime, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MeuOrgaoService {
  private api: string = '/api/v1';
  private base: string = this.api + '/portal-agente/agente';

  constructor(private httpApi: ApiService) {}

  listarUm(id: any): Observable<any> {
    return this.httpApi.get(`${this.base}/${id}/orgao`).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }
}
