import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { Observable, debounceTime, map, catchError, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TipoCrimesService {
  private readonly api: string = '/api/v1/sicgo';
  private readonly base: string = `${this.api}/config/tipicidade-crime`;

  constructor(private httpApi: ApiService) {}

  /**
   * Lista tipos de ocorrência com base nas opções fornecidas.
   * @param options - Filtros e parâmetros de paginação.
   * @returns Observable<any>
   */
  listar(familiaCrimeId: number): Observable<any> {
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

  
  /**
 * Lista tipos de ocorrência com base no ID da família de crime.
 * @param familiaCrimeId - ID da família de crime selecionada.
 * @returns Observable<any>
 */
listarPorFamilia(familiaCrimeId: number): Observable<any> {
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


  /**
   * Lista todos os tipos de ocorrência sem paginação.
   * @param options - Filtros adicionais.
   * @returns Observable<any>
   */
  listarTodos(options: any): Observable<any> {
    return this.httpApi.get(this.base, options).pipe(
      debounceTime(500),
      map((response: any) => response.object || []),
      catchError((error) => {
        console.error("Erro ao listar todos os tipos de ocorrência:", error);
        return of([]); // Retorna um array vazio em caso de erro
      })
    );
  }

  /**
   * Registra um novo tipo de ocorrência.
   * @param item - Dados do novo tipo de ocorrência.
   * @returns Observable<any>
   */
  registar(item: any): Observable<any> {
    return this.httpApi.post(this.base, item).pipe(
      debounceTime(500),
      map((response: any) => response.object || null),
      catchError((error) => {
        console.error("Erro ao registrar tipo de ocorrência:", error);
        return of(null); // Retorna null em caso de erro
      })
    );
  }
}
