import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { BaseService } from '@core/services/interfaces/BaseService.service';
import { BehaviorSubject, Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DinfopDelituosoOrigemService {


  public api: string = '/api/v1/sicgo';
  public base: string = this.api + '/dinfop_delitouso_origem';

  constructor(private httpApi: ApiService) {}


  listar(): Observable<any> {
    return this.httpApi.get(`${this.base}`).pipe(
      debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
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
registar(formData: FormData): Observable<any> {
  console.log('Dados enviados para registro:', formData);
  return this.httpApi.post(`${this.base}`, formData).pipe(
    debounceTime(500),
    map((response: Object): any => {
      console.log('Resposta do servidor:', response);
      return Object(response).object;
    }),
    
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



  ver(id: string|number): Observable<any> {
    return this.httpApi.get(`${this.base}/${id}`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }
  buscarFicha(id: any|number): Observable<any> {
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

// Usando BehaviorSubject para armazenar e compartilhar os dados
private delituosoSource = new BehaviorSubject<any>(null); // Inicializa com null

// Observable para outros componentes se inscreverem e receberem os dados
delituoso$ = this.delituosoSource.asObservable();

 
// Método para atualizar os dados do delituoso
updateDelituoso(data: any) {
  this.delituosoSource.next(data);
}



// Método para atualizar os dados da origem
private idSource = new BehaviorSubject<any>(null); // Armazena o ID
currentId = this.idSource.asObservable(); // Permite que outros componentes observem as mudanças
 
updateOrigem(origem: any): void {
  this.idSource.next(origem); // Atualiza o ID
}



isBusinessDay(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6; // Exclui apenas sábados e domingos
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

}


