import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  public api: string = "/api/v1";
  public base: string = `${this.api}/sigae/armas/painel`;

  constructor(private httpApi: ApiService) {}

  listar(item: any): Observable<any> {
    return this.httpApi.get(`${this.base}`,item).pipe(
      debounceTime(500),
      map((response: Object) => {
        return Object(response).object;
      })
    );
  }
}
