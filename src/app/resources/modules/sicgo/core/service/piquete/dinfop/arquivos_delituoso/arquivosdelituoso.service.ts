import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArquivosdelituosoService {


  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/dinfop_delituoso_arquivos';

  constructor(private httpApi: ApiService) { }
 
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


