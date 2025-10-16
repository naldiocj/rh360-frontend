import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { ApiService } from '@core/providers/http/api.service';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';

export interface ConsultaResponse {
  error: boolean;
  name: string;
  data_de_nascimento: string;
  pai: string;
  mae: string;
  morada: string | null;
  emitido_em: string | null;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class BiconsultaService {
  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/dinfop_delitouso/consulta';
  private apiUrl = 'https://consulta.edgarsingui.ao/consultar'; // URL da API


  constructor(private http: HttpClient, private httpApi: ApiService) {}

   // Método para consultar os dados da API
   consultarDados(): Observable<ConsultaResponse> {
    return this.http.get<ConsultaResponse>(this.apiUrl);
  }

  ver(biNumber: number): Observable<any> {
    return this.httpApi.get(`${this.base}/${biNumber}`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }
  
  // Método para consultar os dados da API com o número do BI
  consultarBI(biNumber: string): Observable<ConsultaResponse> {
    const url = `${this.apiUrl}/${biNumber}`; // Monta a URL com o biNumber
    return this.http.get<ConsultaResponse>(url).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: any) => response)  // Retorna diretamente a resposta
    );
  }
  


}
