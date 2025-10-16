import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { BaseService } from '@core/services/interfaces/BaseService.service';
import { Observable, catchError, debounceTime, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DinfopDelitousoFotoService {


  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/dinfop_fotos';

  constructor(private httpApi: ApiService) { }

  saveDescriptor(personName: string, descritores: number[]) {
    return this.httpApi.post(`${this.base}/save-descriptor`, { person_name: personName, descritores });
  }

  recognize(descritores: number[]) {
    return this.httpApi.post(`${this.base}/recognize`, { descritores });
  }
  registerPerson(data: any): Observable<any> {
    return this.httpApi.post(`${this.base}/register-person`, data);
  }
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

  // Método para buscar os descritores faciais do banco de dados
  public getFaceDatabase(): Observable<any> {
    return this.httpApi.get(`${this.base}/face-database`).pipe(
      debounceTime(500),
      map((response: any): any => {
        return response.object; // Ajuste conforme a estrutura da resposta da API
      }),
      catchError((error) => {
        console.error('Erro ao buscar descritores faciais:', error);
        return throwError(() => new Error('Erro ao buscar descritores faciais.'));
      })
    );
  }
  
  registar(formData: FormData): Observable<any> {
    return this.httpApi.post(`${this.base}`, formData).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      }),
      catchError((error) => {
        console.error('Erro ao registrar:', error);
        return throwError(() => new Error('Erro ao registrar as imagens.')); // Lança o erro
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

  eliminar(id: any): Observable<any> {
    return this.httpApi
      .delete(`${this.base}/${id}`)
      .pipe(
        debounceTime(500),
        map((response: any): Object => {
          return Object(response).object;
        })
      );
  }
}


