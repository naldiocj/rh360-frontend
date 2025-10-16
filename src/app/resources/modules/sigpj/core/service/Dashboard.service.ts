import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { debounceTime, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  public api: string = '/api/v1/sigpj/dashboards';

  constructor(private httpApi: ApiService) { }

  listar_todos(): Observable<any> {
    return this.httpApi
      .get(`${this.api}`)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
  }

}
