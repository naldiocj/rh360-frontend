import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { catchError, Observable, of, Subject, takeUntil } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    private destroy$ = new Subject<void>(); 
    constructor(private socket: Socket) {
        this.conectar()
    }

    public emitirEvento(evento: string, data: any): void {
        this.socket.emit(evento, data)
    }

    public ouvirEvento<T>(evento: string): Observable<T> {
    return this.socket.fromEvent<T>(evento).pipe(
        catchError((err) => {
          console.error(`Erro ao ouvir evento ${evento}:`, err);
          return of(null as unknown as T); // Retorna um valor padrão
        })
      );
}


    /*public ouvirEvento<T>(evento: string): Observable<any> {
        return this.socket.fromEvent<T>(evento).pipe(
            catchError((err) => {
              console.error(`Erro ao ouvir evento ${evento}:`, err);
              return of(null); // Retorna um valor padrão em caso de erro
            })
          );
    }*/


    public conectar(): void {
        if (!this.socket.ioSocket.connected) {
            this.socket.connect();
        }
    }
    

    public desconectar(): void {
        this.socket.disconnect();
        this.destroy$.next(); // Trigger cleanup when disconnecting
        this.destroy$.complete();
    }


}