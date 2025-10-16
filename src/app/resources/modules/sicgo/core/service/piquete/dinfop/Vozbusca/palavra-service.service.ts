import { Injectable } from '@angular/core';  
import { ApiService } from '@core/providers/http/api.service';
import { Observable, catchError, debounceTime, distinctUntilChanged, map, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class PalavraService {
  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/sicgo_palavras';

  constructor(private httpApi: ApiService) {}

  buscarResposta(palavra: string): Observable<any> {
    return this.httpApi.get(`${this.api}/palavras/${palavra}`);
  }

  // salvarPalavra(palavra: string, resposta: string): Observable<any> {
  //   return this.httpApi.post(`${this.api}/palavras`, { palavra, resposta });
  // }
 
  salvarPalavra(palavra: string, resposta: string): Observable<any> {
    return this.httpApi.post(`${this.base}/palavras`, { palavra, resposta }).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }
}
