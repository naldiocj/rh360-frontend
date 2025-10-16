import { Component, OnInit } from '@angular/core';
import { Funcionario } from '@shared/models/Funcionario.model';
import { Pagination } from '@shared/models/pagination';
// import { trim } from 'jquery';
import { finalize } from 'rxjs';
import { FuncionarioService } from '@core/services/Funcionario.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  public funcionarios: Funcionario[] = [];
  public isLoading: boolean = false
  public pagination = new Pagination();
  totalBase: number = 0

  filtro = {
    page: 1,
    perPage: 5,
    regime: 2,
    search: ""
  }

  constructor(private funcionarioServico: FuncionarioService) { }

  ngOnInit() { this.buscarFuncionario() }

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

  filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
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
