import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { debounceTime, map, Observable, of, tap } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  public api: string = '/api/v1/sigpq';
  public data_dashboard:any;

  constructor(private httpApi: ApiService) { }

   listar_todos_nova_estrutura(): Observable<any> {
    return this.httpApi
      .get(`${this.api}/dashboard-nova-estrutura`)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
  }

  listar_todos(): Observable<any> {
    return this.httpApi
      .get(`${this.api}/dashboards`)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
  }

}
