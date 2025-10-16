import { finalize } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Pagination } from '@shared/models/pagination';
import { AgenteService } from '@resources/modules/pa/core/service/agente.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { EscalaTrabalhaService } from '@resources/modules/pa/core/service/escala-trabalha.service';
import { FuncionarioService } from '@core/services/Funcionario.service';

@Component({
  selector: 'app-new-work',
  templateUrl: './new-work.component.html',
  styleUrls: ['./new-work.component.css']
})
export class NewWorkComponent implements OnInit {

  public totalBase: number = 0
  public funcionario: any
  public pagination = new Pagination()
  public escala: any

  public filtro: any = {
    search: '',
    searchBy: ['pst.seccao', 'p.nome_completo', 'pj.sigla', 'dp.sigla', 'dp.sigla', 'dpd.nome_completo', 'pst.created_at','pst.updated_at'],
    order: '',
    page: 1,
    perPage: 5,
    estado: 'E'
  };

  public carregando = false;

  public escalas: any = [];
  constructor(
    private agenteService: AgenteService,
    private utilService: UtilService,
    private escalaTrabalho: EscalaTrabalhaService,
    private funcionarioService: FuncionarioService

  ) {}


  ngOnInit(): void {
    this.buscarEscalaTrabalho();
    this.buscarFuncionario()

  }

  private buscarFuncionario() {
    this.funcionarioService.buscarUm(this.getPessoaId()).pipe().subscribe({
      next: (response: any) => {
        this.funcionario = response
      }
    })
  }

  public buscarEscalaTrabalho(): void {
    this.carregando = true;
    this.filtro.pessoafisica_id = this.getPessoaId()
    this.escalaTrabalho
      .listar(this.filtro)
      .pipe(
        finalize((): void => {
          this.carregando = false;
        })
      )
      .subscribe({
        next: (response: any) => {

          this.escalas = response.data;

          this.totalBase = response.meta.current_page ?
            response.meta.current_page === 1 ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;

          this.pagination = this.pagination.deserialize(response.meta);
        }});
  }

  get temEscala(): boolean {
    return this.escalas.length > 0 ? true : false;
  }

  public getPessoaId(): number | any {
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
    this.buscarEscalaTrabalho()
  }

  public recarregarPagina() {
    this.filtro.search = ''
    this.filtro.page = 1
    this.filtro.perPage = 5

    this.buscarEscalaTrabalho()
  }

  public getTurno(sigla: any): any {
    return this.utilService.turno(sigla).nome
  }

  public getData(data: any) {
    return this.utilService.dataNormal(data).dia.sigla + ' ' + this.utilService.dataNormal(data).mes.sigla + ' ' + this.utilService.dataNormal(data).ano
  }
  public getEstado(status: any): any {
    return this.utilService.estado_escala(status)
  }

  public setEscalaTrabalho(item: any) {
    this.escala = item
  }
  public modalFechado() {
    this.escala = null
  }

}
