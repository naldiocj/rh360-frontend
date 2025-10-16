import { Injectable } from '@angular/core';
import { SocketService } from '@core/providers/socket/socket.service';
import { debounceTime, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketNotificacaoService {

  constructor(private socketService: SocketService) { }

  public onNotificao(): Observable<any> {
    return this.socketService.ouvirEvento<any>('sigpq:notificacao').pipe(
      //debounceTime(500),
      map((response: Object): any => {
        return Object(response).object;
      })
    )
  }

  public ouvindoEm(nomeDoEvento:string)
  {
    return this.socketService.ouvirEvento<any>(nomeDoEvento).pipe(
      map((response: Object): any => {
        return Object(response).object;
      })
    )
  }

  public enviarPara(nomeDoEvento: string, data: any)
  {
    this.socketService.emitirEvento(nomeDoEvento,data)
  }

  public getSocket(){
    return this.socketService
  }
}
