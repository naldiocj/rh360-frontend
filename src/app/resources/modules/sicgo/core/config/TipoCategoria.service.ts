import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { Observable, catchError, debounceTime, map, of } from "rxjs";
 
@Injectable
  ({
    providedIn: 'root'
  })
export class TipoCategoriaService{
 
  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/config/tipo-crime';

  constructor(private httpApi: ApiService) {}

  listar(options: any): Observable<any> {
    return this.httpApi.get(`${this.base}`, options).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  listarum(familiaCrimeId: number): Observable<any> {
    const url = `${this.base}/${familiaCrimeId}`;
    return this.httpApi.get(url).pipe(
        debounceTime(500),
        map((response: any) => response.object || []),
        catchError((error) => {
            console.error(`Erro ao buscar tipos de ocorrência para família ${familiaCrimeId}:`, error);
            return of([]); // Retorna um array vazio em caso de erro
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
  registar(item: any): Observable<any> {
    return this.httpApi.post(`${this.base}`, item).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }
}

