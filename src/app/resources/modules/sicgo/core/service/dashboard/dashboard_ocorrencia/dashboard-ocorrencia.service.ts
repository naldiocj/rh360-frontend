import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, distinctUntilChanged, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardOcorrenciaService {
 
  public api: string = '/api/v1/sicgo_ocorrencia';
  public base: string = this.api + '/dashboards';
  constructor(private httpApi: ApiService,private http: HttpClient, private sanitizer: DomSanitizer) { }


 // Método para buscar os dados do dashboard
 

 getDashboardData(filtros: { provinciaId?: number; municipioId?: number; dataOcorrido?: string; page?: number; perPage?: number} = {}): Observable<any> {
  let params = new HttpParams();

  Object.entries(filtros).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params = params.set(key, value.toString());
    }
  });

  return this.httpApi.get(this.base, params).pipe(
    debounceTime(500),
    distinctUntilChanged(),
    tap(response => console.log('Resposta da API:', response)), // Para debug
    map((response: any) => {
      if (!response) {
        console.error('Erro: Resposta vazia do backend');
        return {}; // Retorna um objeto vazio para evitar erro
      }
      return response; // Retorna a resposta completa
    })
  );
  
}




  listarTodos(): Observable<any> {
    return this.httpApi.get(`${this.base}`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
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
 

  
}
