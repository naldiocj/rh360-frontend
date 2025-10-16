import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { BehaviorSubject, Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipobensService{


  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/tipo-bens';
  constructor(private httpApi: ApiService) {}

  listar(options: any): Observable<any> {
    return this.httpApi.get(`${this.base}`, options).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
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


  editar(item: any, id: number): Observable<any> {
    return this.httpApi.put(`${this.base}/${id}`, item).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  eliminar(item: any, id: number): Observable<any> {
    return this.httpApi.put(`${this.base}/eliminar/${id}`, item).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  ver(id: string|number): Observable<any> {
    return this.httpApi.get(`${this.base}/${id}`).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }




  // private propriedades: any[] = [];  // Armazena os dados de propriedades
  private propriedadesSubject = new BehaviorSubject<any[]>([]); // Inicialmente vazio

  // Observable para ouvir as mudanças
  propriedades$ = this.propriedadesSubject.asObservable();

  // Método para definir (enviar) os propriedades
  setPropriedades(propriedades: any[]): void {
    this.propriedadesSubject.next(propriedades);
  }

  // Método para obter (receber) os propriedades
  getPropriedades(): any[] {
    return this.propriedadesSubject.getValue();
  }


 
  private historicosSubject = new BehaviorSubject<any[]>([]); // Inicialmente vazio

  // Observable para ouvir as mudanças
  historicos$ = this.historicosSubject.asObservable();

  // Método para definir (enviar) os historicos
  setHistoricos(historicos: any[]): void {
    this.historicosSubject.next(historicos); // Atualiza os valores e notifica os assinantes
  }

  // Método para obter o valor atual dos historicos
  getHistoricos(): any[] {
    return this.historicosSubject.getValue(); // Obtém o valor atual
  }
}
