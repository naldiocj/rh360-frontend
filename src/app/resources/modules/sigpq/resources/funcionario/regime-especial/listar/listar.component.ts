import { Component, OnInit } from '@angular/core';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { TipoVinculoService } from '@resources/modules/sigpq/core/service/Tipo-vinculo.service';
import { Funcionario } from '@shared/models/Funcionario.model';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  public funcionarios: Funcionario[] = [];
  public tipoVinculos: Array<Select2OptionData> = []
  public isLoading: boolean = false
  public pagination = new Pagination();
  regimes: any = [
    { id: null, sigla: 'Todos' },
    { id: 1, sigla: 'Especial' },
    { id: 2, sigla: 'Geral' }
  ]

  totalBase: number = 0

  filtro = {
    page: 1,
    perPage: 5,
    regime: null,
    vinculo: null,
    search: ""
  }

  arquivoBase64 = null
  constructor(
    private funcionarioServico: FuncionarioService,
    private tipoVinculoService: TipoVinculoService) { }

  ngOnInit() {
    this.buscarFuncionario()
    this.buscarTipoVinculo();
  }

  buscarFuncionario() {

    this.isLoading = true;
    this.funcionarioServico.listar(this.filtro).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((response) => {

      this.funcionarios = response.data;

      this.totalBase = response.meta.current_page ?
        response.meta.current_page === 1 ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);
    });
  }

  buscarTipoVinculo(): void {
    const opcoes = {}
    let todos = true
    this.tipoVinculoService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        response.map((item: any) => {

          if (todos) {
            todos = false
            this.tipoVinculos.push({
              id: 'null',
              text: 'Todos'
            })
          }

          this.tipoVinculos.push({ id: item.id, text: item.nome })
        })
        
      })
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
      this.filtro.page = 1
    } else if (key == 'regime') {
      this.filtro.regime = $e.target.value;
    } else if (key == 'vinculo') {
      this.filtro.vinculo = $e.target.value;
    }
    this.buscarFuncionario()
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.buscarFuncionario()
  }

  construcao() {
    alert('Em construção')
  }

}
