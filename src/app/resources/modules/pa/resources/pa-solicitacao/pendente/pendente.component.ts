import { Component, Input, OnInit } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { AgenteService } from '@resources/modules/pa/core/service/agente.service';
import { TratamentoPdfSolicitacaoService } from '@resources/modules/pa/core/service/tratamento-pdf-solicitacao.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-pendente',
  templateUrl: './pendente.component.html',
  styleUrls: ['./pendente.component.css']
})
export class PendenteComponent implements OnInit {



  public globalID: any = ''
  public totalBase: number = 0;
  public tratamentos: any

  @Input() public actualiza: any
  public pagination = new Pagination()

  public filtro = {
    search: '',
    page: 1,
    perPage: 5,
    estado: "P"

  };

  public carregando = false;
  public funcionario: any
  public tratamento: any
  public solicitacoes: any = [];
  constructor(
    private agenteService: AgenteService,
    private utilService: UtilService,
    private tratamentoPdfService: TratamentoPdfSolicitacaoService,
    private funcionarioService: FuncionarioService
  ) {

  }

  showSearch() {
    document.querySelector('.search-bar')?.classList.toggle('search-bar-show');
  }


  ngOnInit(): void {
    this.buscarTratamentos();
    this.buscarFuncionarios()
  }

  private buscarFuncionarios() {
    this.funcionarioService.buscarUm(this.getPessoaId).pipe().subscribe({
      next: (response: any) => {
        this.funcionario = response
      }
    })
  }


  private buscarTratamentos() {
    this.carregando = true;
    const options = { ...this.filtro, pessoaId: this.getPessoaId }
    this.tratamentoPdfService
      .listar(options)
      .pipe(
        finalize((): void => {
          this.carregando = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.tratamentos = response.data;



          this.totalBase = response.meta.current_page
            ? response.meta.current_page === 1
              ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;

          this.pagination = this.pagination.deserialize(response.meta);
        },
      });
  }
  get temSolicitacoes(): boolean {
    return this.solicitacoes.length > 0 ? true : false;
  }

  public get getPessoaId(): number | any {
    return this.agenteService.id;
  }

  public filtrarPagina(key: any, event: any) {
    if (key == 'search') {
      this.filtro.search = event;
    } else if (key == 'page') {
      this.filtro.page = event.target.value
    } else if (key == 'perPage') {
      this.filtro.perPage = event.target.value
    }

    this.buscarTratamentos()
  }

  public recarregarPagina() {
    this.filtro.search = ''
    this.filtro.page = 1
    this.filtro.perPage = 5
    

    this.buscarTratamentos()
  }


  public getEstado(status: any): any {
    return this.utilService.estado(status)
  }

  public setTratamento(item: any) {
    this.tratamento = item;
  }

  public setNullTratamento() {
    this.tratamento = null
  }


}
