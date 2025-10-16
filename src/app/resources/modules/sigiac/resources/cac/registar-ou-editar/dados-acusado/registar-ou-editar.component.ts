import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { FuncionarioService } from '@core/services/Funcionario.service';
import { Funcionario } from '@shared/models/Funcionario.model';
import { Pagination } from '@shared/models/pagination';

@Component({
  selector: 'sigiac-dados-acusado',
  templateUrl:'./registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class DadosAcusadoComponent implements OnInit {
  @Output() emitAcusado  = new EventEmitter<Funcionario>()

  totalBase: number = 0
  public funcionarios: Funcionario[] = [];
  public pagination = new Pagination();
  public isLoading: boolean = false
  public Funcionario: Funcionario = new Funcionario();

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: ""
  }


  constructor(private funcionarioServico: FuncionarioService) { }


  ngOnInit(): void {
    this.buscarFuncionarios()
  }


  recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarFuncionarios();
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarFuncionarios();
  }


  buscarFuncionarios() {
    this.funcionarioServico
      .listar(this.filtro)
      .subscribe((response) => {
        this.funcionarios = response.data


        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);

      })

  }


  selectedFuncionario(item: any) {
    this.recarregarPagina()
    this.Funcionario = item
    this.emitAcusado.emit(item)
  }

}
