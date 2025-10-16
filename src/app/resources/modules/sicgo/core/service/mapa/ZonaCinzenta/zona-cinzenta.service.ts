import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '@core/providers/http/api.service';
import { BehaviorSubject, Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZonaCinzentaService {

  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/sicgo/zona-cinzenta';
  constructor(private httpApi: ApiService, private sanitizer: DomSanitizer) { }

 
  listarTodos(): Observable<any> {
    return this.httpApi.get(`${this.base}`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  listarExpedientes(): Observable<any[]> {
    return this.httpApi.get(this.base)
  }

  listar(options: any): Observable<any> {
    return this.httpApi.get(`${this.base}`, options).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => { 
        return Object(response).object;
      })
    );
  }

  register(formData: FormData): Observable<any> {
    return this.httpApi.post(`${this.base}`, formData).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  update(id: number, zona: any): Observable<any> {
    return this.httpApi.put(`${this.base}/${id}`, zona);
  }

  delete(id: number): Observable<any> {
    return this.httpApi.delete(`${this.base}/${id}`);
  }

  eliminarMultiplo(ids: number[]): Observable<any> {
    return this.httpApi
      .post(`${this.base}/eliminar-multiplo`, { ids }) // Use POST em vez de DELETE
      .pipe(
        debounceTime(500),
        map((response: any): Object => {
          return Object(response).object;
        })
      );
  }

  ver(id: number): Observable<any> {
    return this.httpApi.get(`${this.base}/${id}`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  buscarFicha(id: any | number): Observable<any> {
    return this.httpApi
      .get(`${this.base}/${id}/ficha`,)
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
  }

  listarPorid(options: any) {
    return this.httpApi
      .get(`${this.base}`, options)
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map((response: any): any => {
          return response.object;
        })
      );
  }

  salvarCoordenadas(options: any) {
    return this.httpApi
      .get(`${this.base}`, options)
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map((response: any): any => {
          return response.object;
        })
      );
  }
}
