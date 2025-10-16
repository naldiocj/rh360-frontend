import { Injectable } from '@angular/core';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
import { ApiService } from '@core/providers/http/api.service';

@Injectable({
  providedIn: 'root',
})
export class SolicitacaoPaToSigt {
  public api: string = '/api/v1/sigt';
  public base: string = this.api + '/PaToSigt';
  constructor(private httpApi: ApiService) {}

  listar(options: any): Observable<any> {
    return this.httpApi.get(`${this.base}`, options).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  registar(item: any): Observable<any> {
    return this.httpApi.post(`${this.base}`, item).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }


  editar(item: any, id: number): Observable<any> {
    return this.httpApi.put(`${this.base}/${id}`, item).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  eliminar(item: any, id: number): Observable<any> {
    return this.httpApi.put(`${this.base}/eliminar/${id}`, item).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  ver(id: number): Observable<any> {
    return this.httpApi.get(`${this.base}/${id}`).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

//   registarOuEditarPropietario(veiculo_id: number, item: any): Observable<any> {
//     return this.httpApi
//       .post(`${this.base}/registar-ou-editar-propietario/${veiculo_id}`, item)
//       .pipe(
//         debounceTime(500),
//         map((response: Object): any => {
//           return Object(response).object;
//         })
//       );
//   }

//   buscarProprietario(veiculo_id: any): Observable<any> {
//     return this.httpApi
//       .get(`${this.base}/buscar-propietario/${veiculo_id}`)
//       .pipe(
//         debounceTime(500),
//         map((response: Object): any => {
//           return Object(response).object;
//         })
//       );
//   }
}