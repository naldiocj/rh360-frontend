import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { debounceTime, distinctUntilChanged, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreDespachoIndividualService {
  private api: string = '/api/v1/sigvest';
  private base: string = this.api + '/pre_despacho/individual';

  constructor(
    private httpApi: ApiService,
  ) { }

  public listar(options: any): Observable<any> {
    return this.httpApi.get(`${this.base}`, options).pipe(
      distinctUntilChanged(),
      debounceTime(500),
      tap(console.log),
      map((response: Object) => {
        return Object(response).object
      })
    )
  }

  public listarUm(options: any, id: number): Observable<any> {
    return this.httpApi.get(`${this.base}/plano/${id}`, options).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(console.log),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  public registar(pre_despacho_dados: any): Observable<any> {
    console.log(pre_despacho_dados)
    return this.httpApi.post(`${this.base}`, pre_despacho_dados).pipe(
      distinctUntilChanged(),
      debounceTime(500),
      map((response: Object) => {
        return Object(response).object
      })
    )
  }

  public editar(id: number, item: any): Observable<any> {
    return this.httpApi.put(`${this.base}/${id}`, item).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object) => {
        return Object(response).object
      })
    )
  }

  public eliminar(id: number): Observable<void> {
    return this.httpApi.delete(`${this.base}/${id}`).pipe(
      debounceTime(500)
    )
  }
}