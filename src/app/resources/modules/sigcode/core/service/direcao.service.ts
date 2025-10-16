import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DirecaoService {

  public api: string = "/api/v1";
  public base: string = `${this.api}/sigpq/config/direcao-ou-orgao`;

  constructor(private httpApi: ApiService) {}

  listar( item: any): Observable<any> {
    return this.httpApi.get(`${this.base}/`,item).pipe(
      debounceTime(500),
      map((response: Object) => {
        return Object(response).object;
      })
    );
  }
  um(id:any): Observable<any> {
    return this.httpApi.get(`${this.base}/${id}`).pipe(
      debounceTime(500),
      map((response: Object) => {
        return Object(response).object;
      })
    );
  }
  
//opcões abaixo são para caso os dado tenhem que ser filtrados

public filtrar(): Observable<any> {
  return this.httpApi.get(`${this.base}`).pipe(
    debounceTime(500),
    map((response: Object) => {
      return Object(response).object;
    })
  );
}

}
