import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class QrService {

  public api: string = "/api/v1";
  public base: string = `${this.api}/sigcode/config/qrcode`;

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

  deletar( id:number): Observable<any> {
    return this.httpApi.delete(`${this.base}/${id}}`).pipe(
      debounceTime(500),
      map((response: Object) => {
        return Object(response).object;
      })
    );
  }


  actualizar( id:number,item: any): Observable<any> {
    return this.httpApi.put(`${this.base}/${id}}`,item).pipe(
      debounceTime(500),
      map((response: Object) => {
        return Object(response).object;
      })
    );
  }



  registar( item: any): Observable<any> {
    return this.httpApi.post(`${this.base}`,item).pipe(
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
