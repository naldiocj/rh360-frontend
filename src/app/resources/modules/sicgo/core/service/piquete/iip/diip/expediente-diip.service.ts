import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpedienteDiipService {
private expedienteSource = new BehaviorSubject<any>(null);
 
    public api: string = '/api/v1/sicgo';
    public apiUrl: string = this.api + '/diip_expediente';
    constructor(private httpApi: ApiService) {}


listar(options: any): Observable<any> {
    return this.httpApi.get(`${this.apiUrl}`, options).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  listarTodos(): Observable<any[]> {
    return this.httpApi
      .get(this.apiUrl)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      );
  }

  listarExpedientes(): Observable<any[]> {
    return this.httpApi.get(this.apiUrl).pipe(
      map((response: any) => {
        // Se a resposta for uma string JSON, converter para array
        if (typeof response === 'string') {
          return JSON.parse(response);
        }
        return response;
      })
    );
  }
  
  

  registar(item: any): Observable<any> {
    return this.httpApi.post(`${this.apiUrl}`, item).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  } 



  

  transformarOcorrencia(occurrence: any): Observable<any> {
    return this.httpApi.post(`${this.apiUrl}/transformar-ocorrencia`, { occurrence })
  }

 
  despacharExpediente(id: number, dados: any): Observable<any> {
    return this.httpApi.put(`${this.apiUrl}/${id}/despachar`, {dados})
  }

  remeterMinisterio(id: number, nup: string): Observable<any> {
    return this.httpApi.put(`${this.apiUrl}/${id}/remeter-ministerio`, { nup })
  }

  receberOpcs(id: number): Observable<any> {
    return this.httpApi.put(`${this.apiUrl}/${id}/receber-opcs`, {})
  }

  distribuirChefia(id: number): Observable<any> {
    return this.httpApi.put(`${this.apiUrl}/${id}/distribuir-chefia`, {})
  }

  distribuirDepartamento(id: number): Observable<any> {
    return this.httpApi.put(`${this.apiUrl}/${id}/distribuir-departamento`, {})
  }

  iniciarInstrucao(id: number): Observable<any> {
    return this.httpApi.put(`${this.apiUrl}/${id}/iniciar-instrucao`, {})
  }

  concluirExpediente(id: number): Observable<any> {
    return this.httpApi.put(`${this.apiUrl}/${id}/concluir`, {})
  }

  //QWERTY







  criarExpediente(dados: any): Observable<any> {
    return this.httpApi.post(this.apiUrl, dados)
  }

  listarExpedientesPorResponsavel(role: string): Observable<any[]> {
    return this.httpApi.get(`${this.apiUrl}?role=${role}`)
  }
 
  

  atualizarInvestigacao(id: number, investigacao: string): Observable<any> {
    return this.httpApi.put(`${this.apiUrl}/${id}/atualizar-investigacao`, { investigacao })
  }

  adicionarEvidencias(id: number, evidencias: any): Observable<any> {
    return this.httpApi.put(`${this.apiUrl}/${id}/adicionar-evidencias`, { evidencias })
  }

  anexarDocumentos(id: number, documentos: any): Observable<any> {
    return this.httpApi.put(`${this.apiUrl}/${id}/anexar-documentos`, { documentos })
  }

  

  atribuirResponsavel(expedienteId: number, responsavel: string): Observable<any> {
    return this.httpApi.put(`${this.apiUrl}/atribuir-responsavel`, { expedienteId, responsavel });
  }
}
