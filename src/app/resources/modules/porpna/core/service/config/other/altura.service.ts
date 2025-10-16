import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { BaseService } from '@core/services/interfaces/BaseService.service';
import { Observable, debounceTime, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlturaService extends BaseService {

  public api: string = '/api/v1';
  public base_: string = this.api + '/porpna/config/other/alturas';

  constructor(httpApi: ApiService) {
    super(httpApi, '/porpna/config/other/alturas');
  }

  public activar(id:any):Observable<any>{
    return this.httpApi
    .put(`${this.base}/${id}/activar`)
    .pipe(
        debounceTime(500),
        map((response: Object): any => {
            return Object(response).object;
        })
    )
  }
}
