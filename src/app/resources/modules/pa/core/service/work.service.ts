import { Injectable } from '@angular/core';
import { ApiService } from '@core/providers/http/api.service';
import { Observable, debounceTime, map } from 'rxjs';

interface Base{
    api:string
    full:string
}
@Injectable({
  providedIn: 'root'
})
export class WorkService {
  public base:Base
  constructor(private httpApi:ApiService) { 

    this.base = {
        api: '/api/v1',
        full: '/api/v1/agente/portal-agente/escala-trabalho'
    }
  }

  public listar(pessoaId:number,option:any):Observable<any>{
      return this.httpApi
        .get(`${this.base.full}/agente/${pessoaId}`,option)
          .pipe(
            debounceTime(500),
            map((response:Object)=>{
              return Object(response).object
            })
          )
  }

  public item(pessoaId:number):Observable<any>{
        return this.httpApi
                  .get(`${this.base.full}/agente/${pessoaId}/nova`)
                  .pipe(
                    debounceTime(500),
                    map((response:Object)=>{
                      return Object(response).object
                    })
                  )
  }


  public comecar(pessoaId:number, id:number):Observable<any>{
      return this.httpApi.
          get(`${this.base.full}/agente/${pessoaId}/comecar/${id}`)
          .pipe(
            debounceTime(500),
            map((response:Object)=>{
              return Object(response).object
            })
          )
  }
}
