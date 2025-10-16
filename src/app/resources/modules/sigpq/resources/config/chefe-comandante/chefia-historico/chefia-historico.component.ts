import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { ChefiaComandoService } from '@resources/modules/sigpq/core/service/Chefia-Comando.service';
import { Pagination } from '@shared/models/pagination';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chefia-historico',
  templateUrl: './chefia-historico.component.html',
  styleUrls: ['./chefia-historico.component.css']
})
export class ChefiaHistoricoComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>()
  public pagination: Pagination = new Pagination()
  public chefias: any[] = []
  public agente: any = null
  public totalBase: number = 0
  public filtro = {
    search: '',
    page: 1,
    perPage: 5,

  }
  public carregando: boolean = false;

  constructor(private funcionarioService: FuncionarioService, private chefiaComandoService: ChefiaComandoService, private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  ngOnInit(): void {
    if (!this.agenteId) return
    this.buscarDados()

  }

  private buscarDados() {
    this.buscarChefiaComando()
    this.buscarFuncionario()
  }

  public get agenteId() {
    return this.route.snapshot.params['pessoaId']
  }

  private buscarFuncionario() {
    this.funcionarioService.buscarUm(this.agenteId).pipe(
      takeUntil(this.destroy$),
      finalize((): void => {

      })
    ).subscribe({
      next: (response: any) => {
        this.agente = response

        console.log(this.agente)
      }
    })
  }


  private buscarChefiaComando() {
    this.carregando = true


    this.chefiaComandoService.listarTodos({ pessoa_id: this.agenteId, ...this.filtro }).pipe(
      takeUntil(this.destroy$),
      finalize((): void => {
        this.carregando = false
      })
    ).subscribe({
      next: (response: any) => {
        this.chefias = response.data

        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);

      }
    })
  }

  filtrarPagina(key: any, $e: any, reiniciar: boolean = true) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }

    this.buscarChefiaComando()
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''

    this.buscarChefiaComando()
  }

}
