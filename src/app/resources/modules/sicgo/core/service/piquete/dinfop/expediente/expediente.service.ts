import { Injectable } from '@angular/core';
import { Observable, debounceTime, map, distinctUntilChanged, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '@core/providers/http/api.service';

// agent.interface.ts
export interface Agent {
  id: number;
  funcionario_id: number;
  codinome: string;
  perfilId: number;
  descricao: string | null;
  activo: number;
  eliminado: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  tipo_perfil_nome: string;
  formatted_created_at: string;
  formatted_updated_at: string;
}

export interface ApiResponse {
  statusCode: number;
  object: Agent[];
}

@Injectable({
  providedIn: 'root'
})
export class ExpedienteService {
  emit(occurrence: any) {
    throw new Error('Method not implemented.');
  }
  private expedienteSource = new BehaviorSubject<any>(null);
  currentExpedienteSource = this.expedienteSource.asObservable();

  private sharingEnabledSource = new BehaviorSubject<boolean>(false);
  sharingEnabled = this.sharingEnabledSource.asObservable();

  private sharingDisabledSource = new BehaviorSubject<boolean>(true);
  sharingDisabled = this.sharingDisabledSource.asObservable();


  //Agente

  private selectedAgentsSource = new BehaviorSubject<ApiResponse>({
    statusCode: 200,
    object: []
  });

  selectedAgents$ = this.selectedAgentsSource.asObservable();

  
  updateSelection(agents: Agent[]) {
    this.selectedAgentsSource.next({
      statusCode: 200,
      object: agents
    });
  }

  private partilhaEnabledSource = new BehaviorSubject<boolean>(false);
  partilhaEnabled = this.partilhaEnabledSource.asObservable();

  private partilhaDisabledSource = new BehaviorSubject<boolean>(true);
  partilhaDisabled = this.partilhaDisabledSource.asObservable();
  //Agente


  // Atualiza a lista de agentes selecionados
  setSelectedAgents(agents: any[]) {
    this.selectedAgentsSource.next({
      statusCode: 200,
      object: agents
    });
  }
  enablePartilha(enable: boolean): void {
    this.partilhaEnabledSource.next(enable);
  }

  disablePartilha(enable: boolean): void {
    this.partilhaDisabledSource.next(enable);
  }



  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/delituoso_expediente';

  constructor(private httpApi: ApiService, private http: HttpClient) { }


  setOccurrence(occurrence: any): void {
    this.expedienteSource.next(occurrence);
  }

  enableSharing(enable: boolean): void {
    this.sharingEnabledSource.next(enable);
  }

  disableSharing(enable: boolean): void {
    this.sharingDisabledSource.next(enable);
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
    return this.httpApi.get(`${this.base}`, options).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: any): any => {
        return response;
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


  generatePDF(expediente: any): Observable<Blob> {
    
   
    return this.httpApi.post(
      `${this.base}/${expediente.id}/generate-pdf`,
      expediente
    );
  }

  addDelituosoExpediente(expedienteId: number, suspeitosIds: number[]): Observable<any> {
    return this.httpApi.post(`${this.base}/${expedienteId}/suspeitos`, { expedienteId, suspeitosIds });
  }

  removeDelituosoExpediente(delituosoId: number, suspeitosIds: number[]): Observable<any> {
    return this.httpApi.delete(`${this.base}/${delituosoId}/suspeitos`);
  }



  private holidays: string[] = []; // Adicione os feriados

  isBusinessDay(date: Date): boolean {
    const day = date.getDay();
    const isHoliday = this.holidays.some(
      holiday => new Date(holiday).toDateString() === date.toDateString()
    );
    return day !== 0 && day !== 6 && !isHoliday; // Exclui sábado, domingo e feriados
  }

  addBusinessDays(startDate: Date, days: number): Date {
    let currentDate = new Date(startDate);
    while (days > 0) {
      currentDate.setDate(currentDate.getDate() + 1);
      if (this.isBusinessDay(currentDate)) {
        days--;
      }
    }
    return currentDate;
  }



  // Método para prorrogar o expediente enviando a nova data para o backend
  prorrogarExpediente(expedienteId: number, endEditDate: Date): Observable<any> {
    return this.httpApi.put(`${this.base}/${expedienteId}/prorrogar`, { endEditDate });
  }

}
