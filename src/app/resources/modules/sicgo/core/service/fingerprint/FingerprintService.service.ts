import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../../../../../../core/providers/http/api.service';

export interface Fingerprint {
  id: number;
  thumb: string;
  url: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class FingerprintService {
 
  private readonly api = '/api/v1/sicgo/dinfop_delitouso_biometrico/biometrico';

  constructor(private http: HttpClient, private apiService: ApiService) {}

  /** Método Genérico para `POST` */
  private post<T>(endpoint: string, data?: any): Observable<T> {
    return this.http.post<T>(`${this.api}/${endpoint}`, data).pipe(
      map((response: any) => response.object),
      catchError(this.handleError<T>(`POST ${endpoint}`))
    );
  }

  /** Método Genérico para `GET` */
  private get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http
      .get<T>(`${this.api}/${endpoint}`, { params })
      .pipe(catchError(this.handleError<T>(`GET ${endpoint}`)));
  }

  /** Método Centralizado de Tratamento de Erros */
  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<T> => {
      return throwError(() => error); // Permite tratar o erro no componente
    };
  }

  /** Abrir o dispositivo biométrico */
  open(): Observable<any> {
    return this.post<any>('open');
  }

   /**
   * Busca uma impressão digital no banco de dados
   * @param template O template da impressão digital a ser buscada
   * @returns Observable com o resultado da busca
   */
   searchFingerprint(template: string): Observable<any> {
    return this.apiService.post(`${this.api}/search`, { template }).pipe(
      map((response: any) => {
        // Processa a resposta do servidor
        return {
          match: response.match || false,
          id: response.id || null,
          name: response.name || null,
          score: response.score || 0,
          additionalData: response.additionalData || null
        };
      }),
      catchError(error => {
        console.error('Erro na busca de digital:', error);
        throw error;
      })
    );
  }
  saveFingerprints(delituosoId: number, fingerprints: any): Observable<any> {
    return this.apiService.post(
      `${this.api}/save-fingerprints/${delituosoId}`,
      { fingerprints }
    );
  }

  getSavedFingerprints(delituosoId: number): Observable<any> {
    return this.apiService.get(`${this.api}/saved-fingerprints/${delituosoId}`);
  }

  /** Cadastrar digital */
  enroll(): Observable<any> {
    return this.post<any>('enroll');
  }

  /** Registrar digital */
  register(data: FormData): Observable<any> {
    return this.post<any>('', data);
  }

  /** Fechar o dispositivo biométrico */
  close(): Observable<any> {
    return this.post<any>('close');
  }

  /** Identificar digital */
  identify(): Observable<any> {
    return this.post<any>('identify');
  }

  /** Verificar digital */
  checking(): Observable<any> {
    return this.post<any>('verify-fingerprint');
  }

  /** Buscar todas as digitais por filtro */
  findAll(filtro: { filtro_id: string }): Observable<Fingerprint[]> {
    const params = new HttpParams().set('filtro_id', filtro.filtro_id);
    return this.get<Fingerprint[]>('', params);
  }

  /** Buscar digital por ID */
  findById(id: number): Observable<Fingerprint | null> {
    return this.get<Fingerprint>(`${id}`);
  }

  /** Criar digital */
  createFingerprint(data: any): Observable<Fingerprint | null> {
    return this.post<Fingerprint>('', data);
  }

  /** Atualizar digital */
  updateFingerprint(id: number, data: any): Observable<Fingerprint | null> {
    return this.post<Fingerprint>(`${id}`, data);
  }

  /** Excluir digital */
  deleteFingerprint(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.api}/${id}`)
      .pipe(catchError(this.handleError<void>(`DELETE ${id}`)));
  }
}
