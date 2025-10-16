import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { BaseService } from '@core/services/interfaces/BaseService.service';
import { Observable, throwError, debounceTime, distinctUntilChanged, map, BehaviorSubject } from 'rxjs';
import { NotificacaoService } from './notificacao/notificacao.service';

interface VozSearchResponse {
  object: any;
  // Add other fields as necessary depending on the API response structure
}
interface DelituosoResponse {
  data: any[];  // ou o tipo correto de cada delituoso
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    // outras propriedades de paginação
  };
}

@Injectable({
  providedIn: 'root'
})
export class DinfopDelitousoService {



  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/dinfop_delitouso';

  constructor(private notificacaoService: NotificacaoService,private httpApi: ApiService, private http: HttpClient) { }


  listar(): Observable<any> {
    return this.httpApi.get(`${this.base}`).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  listarTodos(options: any): Observable<any> {
    return this.httpApi.get(`${this.base}`, options).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  listarTodo(options: any): Observable<DelituosoResponse> {
    return this.httpApi.get(`${this.base}`, options).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: DelituosoResponse): DelituosoResponse => {
        return response;  // Agora o response é do tipo correto
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
  ver(id: number): Observable<any> {
    return this.httpApi.get(`${this.base}/${id}`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }
  buscarFicha(id: any | number): Observable<any> {
    return this.httpApi
      .get(`${this.base}/${id}/ficha`,)
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
  }
  buscarPorProvincia(provinciaId: any | number): Observable<any> {
    return this.httpApi
      .get(`${this.base}/${provinciaId}/provincia`,)
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map((response: Object): any => {
          return Object(response).object;
        })
      )
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

  eliminarMultiplo(ids: number[]): Observable<any> {
    return this.httpApi
      .post(`${this.base}/eliminar-multiplo`, { ids }) // Use POST em vez de DELETE
      .pipe(
        debounceTime(500),
        map((response: any): Object => {
          return Object(response).object;
        })
      );
  }


  stados(id: any, kvState: string): Observable<any> {
    return this.httpApi
      .put(`${this.base}/${id}/status`, { estado: kvState }) // Envia o estado como parte do corpo da requisição
      .pipe(
        debounceTime(500),
        map((response: any): Object => {
          return Object(response).object;
        })
      );
  }

  status(id: any, kvState: string): Observable<any> {
    return this.httpApi
      .put(`${this.base}/${id}/status`, { estado: kvState }) // Envia o estado como parte do corpo da requisição
      .pipe(
        debounceTime(500),
        map((response: any): Object => {
          return Object(response).object;
        })
      );
  }
  statusR(id: any): Observable<any> {
    return this.httpApi
      .put(`${this.base}/${id}/statusr`) // Envia o estado como parte do corpo da requisição
      .pipe(
        debounceTime(500),
        map((response: any): Object => {
          return Object(response).object;
        })
      );
  }


  statusMultiplo(ids: number[]): Observable<any> {
    return this.httpApi
      .put(`${this.base}/status`, { ids }) // Use POST em vez de DELETE
      .pipe(
        debounceTime(500),
        map((response: any): Object => {
          return Object(response).object;
        })
      );
  }

  searchFace(faceData: Float32Array): Observable<any> {
    return this.httpApi.post(`${this.base}/face-search`, { faceData });
  }
 searchFacess(facedata: number[]): Observable<any> {
  return this.httpApi.post(`${this.base}/face-search`, { facedata });
}

  addGrupo(delituosoId: number, grupos: number[]): Observable<any> {
    return this.httpApi.post(`${this.base}/${delituosoId}/grupos`, { delituosoId, grupos });
  }

  removeGrupo(delituosoId: number, grupos: number[]): Observable<any> {
    return this.httpApi.delete(`${this.base}/${delituosoId}/grupos`);
  }






  vozbusca(search: String): Observable<any> {
    // Check if the search query is empty or invalid
    if (!search || !search.trim()) {
      return throwError(new Error('Query cannot be empty'));
    }

    // Proceed with the request if the query is valid
    return this.httpApi.post(`${this.base}/vozsearch`, { search }).pipe(
      debounceTime(500),
      map((response: any): any => {
        return response?.object || response;
      })
    );
  }


  searchBackend(query: string): void {
    if (!query || query.trim() === '') {
      console.error('Query não pode ser vazia');
      return;
    }

    this.http.post('http://localhost:3334/api/v1/sicgo/dinfop_delitouso/vozsearch', { query })
      .subscribe(
        response => {
          console.log('Resposta do backend:', response);
        },
        error => {
          console.error('Erro ao buscar no backend:', error);
        }
      );
  }





  private idSource = new BehaviorSubject<number | null>(null); // Armazena o ID
  currentId$ = this.idSource.asObservable(); // Permite que outros componentes observem as mudanças

  enviarId(id: number) {
    this.idSource.next(id); // Atualiza o ID
  }

















//verificação dos dados para notificação
verificarDadosDelituoso(delituoso: any): void {
  // Lista de campos a verificar
  const campos = [
    "alcunha",
    "nomePai",
    "nomeMae",
    "dataNascimento",
    "sicgo_naturalidade_id",
    "natural",
    "sicgo_estadocivil_id",
    "profissao",
    "habilitacaoL",
    "residencia",
    "sicgo_nacionalidade_id",
    "pais",
    "sicgo_municipio_id",
    "municipio",
    "sicgo_provincia_id",
    "provincia",
    "tipo_identidade",
    "tipo_identificao",
    "numero_identidade",
    "dataEmissao",
    "localEmissao",
    "dataentrada_angola",
    "fronteira",
    "fotografias"
  ];

  // Função para verificar se o campo está vazio ou nulo
  const isEmpty = (value: any) =>
    value === null || value === undefined || value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0);

  // Filtra os campos que estão vazios ou nulos
  const camposFaltando = campos.filter(campo => isEmpty(delituoso[campo]));

  // Se houver campos faltando, notifica
  if (camposFaltando.length > 0) {
    const mensagem = `Delituoso dados a falta: ${camposFaltando.join(', ')}`;
    this.notificacaoService.notify(mensagem);
  } else {
    this.notificacaoService.notify('Todos os dados estão completos.');
  }
}
}


