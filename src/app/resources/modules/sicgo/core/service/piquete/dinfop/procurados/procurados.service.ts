import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { BaseService } from '@core/services/interfaces/BaseService.service';
import { Observable } from 'rxjs';
import { debounceTime, catchError, map } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root'
})
export class ProcuradosService {

 public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/delituosos_procurados';

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
        debounceTime(300),
        map((response: any): any => {
          return response.object;
        }),
        catchError(error => {
          console.error('Erro ao listar delituosos', error);
          throw error; // Retorne o erro para ser tratado
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
 
  ver(id: number): Observable<any> {
    return this.httpApi.get(`${this.base}/${id}`).pipe(
      debounceTime(500), 
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }
  editar(formData: any, delituosoIds: number[]): Observable<any> {
     // URL da API de edição com o ID principal
  const url = `${this.base}/${formData.id}`;
 // Adiciona os IDs ao payload (se necessário)
 const payload = { ...formData, delituosoIds };

  return this.httpApi
      .put(url, payload)
      .pipe(
        debounceTime(500),
        map((response: any): any => {
          return response.object;
        })
      );
  }

  addProcurados(descricao: string, delituosoIds: number[]): Observable<any> {
    return this.httpApi.post(`${this.base}/procurados`, {delituosoIds:delituosoIds, descricao:descricao });
  }

  // Método para eliminar delituoso
  removeDelituosoById(id: any): Observable<any> {
    return this.httpApi
      .delete(`${this.base}/${id}/procurados`) // Envia o estado como parte do corpo da requisição
      .pipe(
        debounceTime(500),
        map((response: any): Object => {
          return Object(response).object;
        })
      );
  }
}


 
