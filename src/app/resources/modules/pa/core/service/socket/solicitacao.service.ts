import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SolicitaoSocketService {
  private socket: Socket;
  constructor() {
    this.socket = io(environment.app_url, {
      transports: ['websocket', 'polling', 'flashsocket'],
      autoConnect: false,
    }
    );
  }

  public entrarSala(data: any): void {
    this.socket.emit('entrar', data);
  }

  public enviar(data: any): void {
    this.socket.emit('solicitacao:enviada', data);
  }

  public recebe(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('solicitacao:recebida', (data) => {
        
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
  public cancelado(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('solicitacao:cancelado', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  public getSocket = (): Socket => {
    return this.socket;
  };

  public pegarNotificacao(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('solicitacao:tratamento', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }
  public jaRecebido(data: any) {
    this.socket.emit('solicitacao:jaRecebida', data);
  }

  public cancelar(data: any) {
    this.socket.emit('solicitacao:cancelar', data);
  }

  public jaCancelado(data:any){
    this.socket.emit('solicitacao:jaCancelado', data);
  }
}
