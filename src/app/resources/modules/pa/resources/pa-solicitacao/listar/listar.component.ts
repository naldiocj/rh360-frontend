import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { AgenteService } from '@resources/modules/pa/core/service/agente.service';
import { TipoEventosService } from '@resources/modules/pa/core/service/config/tipo-eventos.service';
import { EventoService } from '@resources/modules/sigpq/core/service/Evento.service';

import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  public evento: any = null;
  public tituloForm: any

  public solicitacaoTexto: any
  public isLoading: boolean = false;
  public cache_id: any
  public eventos: any
  public actualiza: boolean = true;

  constructor(
    private secureService: SecureService,
    private agenteService: AgenteService,
    private tipoEventoService: TipoEventosService,

  ) { }

  ngOnInit(): void {
    this.todosEventos();
  }


  public get pessoa_id(): any {
    return this.agenteService.id
  }
  todosEventos() {
    this.isLoading = true;
    this.tipoEventoService
      .listar(null)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.eventos = response
      });
  }

  public get getPessoaId(): number {
    return this.secureService.getTokenValueDecode().pessoa.id as number;
  }

  public toggleContainer() {

    const evento: HTMLDivElement = document.querySelector('.evento') as HTMLDivElement
    const solicitacao: HTMLDivElement = document.querySelector('.solicitacao') as HTMLDivElement

    if (evento && solicitacao) {

      evento.classList.toggle('d-none')
      evento.classList.toggle('col-xl-2')
      evento.classList.toggle('col-lg-3')
      evento.classList.toggle('col-md-5')
      evento.classList.toggle('col-sm-12')

      solicitacao.classList.toggle('col-xl-10')
      solicitacao.classList.toggle('col-lg-9')
      solicitacao.classList.toggle('col-md-7')
      solicitacao.classList.toggle('col-sm-12')


      solicitacao.classList.toggle('col-xl-12')
      solicitacao.classList.toggle('col-lg-12')
      solicitacao.classList.toggle('col-md-12')
      solicitacao.classList.toggle('col-sm-12')

    }

  }

  public setTipoEvento(evento: any) {
    this.evento = evento;
  }

  public onActualizado() {
    this.actualiza = false;
    this.evento = null
  }
}
