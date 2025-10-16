import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { BaseService } from '@core/services/interfaces/BaseService.service';
import { Observable, throwError, debounceTime, distinctUntilChanged, map, BehaviorSubject } from 'rxjs';
 
interface VozSearchResponse {
  object: any;
  // Add other fields as necessary depending on the API response structure
}

@Injectable({
  providedIn: 'root'
})
export class DelituosoTratamentoService {



  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/dinfop_delitouso-tratamento';

  constructor(private httpApi: ApiService, private http: HttpClient) { }


  listar(): Observable<any> {
    return this.httpApi.get(`${this.base}`).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  listarTodos(options: any): Observable<any> {
    return this.httpApi
      .get(this.base, options)
      .pipe(
        debounceTime(500),
        map((response: any): any => {
          return response.object;
        })
      );
  }
  registar(formData: FormData): Observable<any> {
    return this.httpApi.post(`${this.base}`, formData).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  editar(formulario: any, id: any): Observable<any> {
    return this.httpApi
      .put(`${this.base}/${id}`, formulario)
      .pipe(
        debounceTime(500),
        map((response: any): any => {
          return response.object;
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
 

  stados(id: any, kvState: string): Observable<any> {
    return this.httpApi
      .put(`${this.base}/${id}/stados`, { estado: kvState }) // Envia o estado como parte do corpo da requisição
      .pipe(
        debounceTime(500),
        map((response: any): Object => {
          return Object(response).object;
        })
      );
  }

  status(id: any, kvState: string): Observable<any> {
    return this.httpApi
      .put(`${this.base}/${id}/status`, { status: kvState }) // Envia o estado como parte do corpo da requisição
      .pipe(
        debounceTime(500),
        map((response: any): Object => {
          return Object(response).object;
        })
      );
  }
  status1(id: any, kvState: string, descricao: string): Observable<any> {
    return this.httpApi
      .put(`${this.base}/${id}/status1`, { status: kvState , descricao: descricao }) // Envia o estado como parte do corpo da requisição
      .pipe(
        debounceTime(500),
        map((response: any): Object => {
          return Object(response).object;
        })
      );
  }

  statusMultiplo(ids: number[]): Observable<any> {
    return this.httpApi
      .put(`${this.base}/status`, { ids }) // Use POST em vez de DELETE
      .pipe(
        debounceTime(500),
        map((response: any): Object => {
          return Object(response).object;
        })
      );
  }
  
 
}


