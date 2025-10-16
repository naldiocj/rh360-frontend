import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UtilsHelper } from '@core/helper/utilsHelper';
import { FuncionarioService } from '@core/services/Funcionario.service';

import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { AgenteService } from '@resources/modules/pa/core/service/agente.service';

import { SolicitacaoService } from '@resources/modules/pa/core/service/solicitacao.service';
import { Pagination } from '@shared/models/pagination';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-solicitacao-enviada',
  templateUrl: './solicitacao-enviada.component.html',
  styleUrls: ['./solicitacao-enviada.component.css']
})
export class SolicitacaoEnviadaComponent implements OnInit, OnChanges {

  public simpleForm!: FormGroup
  public totalBase: number = 0
  private destroy$: Subject<void>

  @Output() public onActualizado: EventEmitter<any>;
  @Input() public actualiza: any
  public pagination = new Pagination()

  public filtro = {
    search: '',
    page: 1,
    perPage: 5,
    estado: 'E'
  };

  public carregando = false;
  public solicitacoes: any = [];
  public solicitacao: any
  public funcionario: any

  constructor(
    private agenteService: AgenteService,
    private solicitacaoService: SolicitacaoService,
    private utilService: UtilService,
    private funcionarioService: FuncionarioService,
    private utilsHelper: UtilsHelper

  ) {
    this.onActualizado = new EventEmitter<any>()
    this.destroy$ = new Subject<void>()
  }
  ngOnInit(): void {
    this.buscarSolicitacao();
    this.buscarFuncionario()
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['actualiza'].previousValue != changes['actualiza'].currentValue) {
      this.recarregarPagina()
      this.onActualizado.emit({ actualiza: true })
    }
  }
  public buscarSolicitacao(): void {
    this.carregando = true;
    this.solicitacaoService
      .listar({ ...this.filtro, agente_id: this.getPessoaId() })
      .pipe(
        finalize((): void => {
          this.carregando = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response: any) => {
          this.solicitacoes = response.data;


          this.totalBase = response.meta.current_page ?
            response.meta.current_page === 1 ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;

          this.pagination = this.pagination.deserialize(response.meta);
        }
      });
  }

  get temSolicitacoes(): boolean {
    return this.solicitacoes.length > 0 ? true : false;
  }

  public getPessoaId(): number | any {
    return this.agenteService?.id;
  }

  public filtrarPagina(key: any, event: any) {
    if (key == 'search') {
      this.filtro.search = event;
    } else if (key == 'page') {
      this.filtro.page = event
    } else if (key == 'perPage') {
      this.filtro.perPage = event.target.value
    }

    this.buscarSolicitacao()
  }

  public recarregarPagina() {
    this.filtro.search = ''
    this.filtro.page = 1,
      this.filtro.perPage = 5

    this.buscarSolicitacao()
  }


  public getEstado(status: any): any {
    return this.utilService.estado(status)
  }

  public reset() {
    this.simpleForm.reset()
    this.recarregarPagina()
  }

  public setSolicitacao(item: any) {
    this.solicitacao = item;
  }


  public setNullSolicitacao() {
    this.solicitacao = null;
  }

  public buscarFuncionario() {
    this.funcionarioService.buscarUm(this.getPessoaId())
      .pipe(
        finalize((): void => {
        })
      ).subscribe({
        next: (response: any) => {
          this.funcionario = response
        }
      })
  }

}
