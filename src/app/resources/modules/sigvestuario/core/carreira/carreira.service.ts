import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { debounceTime, distinctUntilChanged, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarreiraService {
  private api: string = '/api/v1/sigpq';
  private base: string = this.api + '/config/tipo-carreira-ou-categoria';

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

  public registar(tipo_de_carreira_ou_categoria: any): Observable<any> {
    console.log(tipo_de_carreira_ou_categoria)
    return this.httpApi.post(`${this.base}`, tipo_de_carreira_ou_categoria).pipe(
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