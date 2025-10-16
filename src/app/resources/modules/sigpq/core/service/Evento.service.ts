import { Injectable } from "@angular/core";
import { ApiService } from "@core/providers/http/api.service";
import { debounceTime, map, Observable } from 'rxjs';
import { Evento } from "../../shared/model/evento.model";


@Injectable({
    providedIn: 'root',
})
export class EventoService {

    public api: string = '/api/v1';
    public base: string = this.api + '/sigpq/evento';

    constructor(private httpApi: ApiService) { }

    listar(options: any): Observable<any> {
        return this.httpApi
            .get(`${this.base}`, options)
            .pipe(
                debounceTime(500),
                map((response: Object): Evento => {
                    return Object(response).object;
                })
            )
    }

    listarPorEstado(options: any): Observable<any> {
        return this.httpApi
            .get(`${this.base}/estado`, options)
            .pipe(
                debounceTime(500),
                map((response: Object): Evento => {
                    return Object(response).object;
                })
            )
    }

    registar(item: any): Observable<any> {
        return this.httpApi
            .post(`${this.base}`, item)
            .pipe(
                debounceTime(500),
                map((response: Object): any => {
                    return Object(response).object;
                })
            )
    }

    estado(opcao: any): any {
        return [
            {
                sigla: 'P',
                nome: 'Pendente',
                icone: 'fa fa-unlock'
            },
            {
                sigla: 'E',
                nome: 'Enviado',
                icone: 'fa fa-lock'
            }, {
                sigla: 'C',
                nome: 'Cancelado',
                icone: 'fa fa-window-close'
            }, {
                sigla: 'A',
                nome: 'Aprovado',
                icone: 'fa fa-check-circle'
            }, {
                sigla: 'R',
                nome: 'Recuzado',
                icone: 'fa fa-ban'
            },
        ].find((o) => o.sigla === opcao)
    }

    estadoTodos(): any[] {
        return [
            {
                sigla: 'P',
                nome: 'Pendente',
                icone: 'fa fa-unlock'
            },
            {
                sigla: 'E',
                nome: 'Enviado',
                icone: 'fa fa-lock'
            }, {
                sigla: 'C',
                nome: 'Cancelado',
                icone: 'fa fa-window-close'
            }, {
                sigla: 'A',
                nome: 'Aprovado',
                icone: 'fa fa-check-circle'
            }, {
                sigla: 'R',
                nome: 'Recuzado',
                icone: 'fa fa-ban'
            },
        ]
    }
}