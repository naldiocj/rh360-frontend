import { Component, OnInit } from '@angular/core';
import { InstituicoesService } from '@resources/modules/sigef/core/service/instituicoes.service';

import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent implements OnInit {
  public pagination = new Pagination();
  public totalBase: number = 0;
  public isLoading: boolean = false;

  instituicoes: any = [];

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: '',
  };

  constructor(private instituicoesservice: InstituicoesService) {
    this.buscarInstituicoes();
  }

  ngOnInit(): void {
    this.buscarInstituicoes();
  }

  buscarInstituicoes() {
    this.instituicoesservice
      .listar(this.filtro)
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (response: any) => {
          this.instituicoes = response.data;
          console.log(response);

          this.totalBase = response.meta.current_page
            ? response.meta.current_page === 1
              ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;
          this.pagination = this.pagination.deserialize(response.meta);
        },
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
    this.buscarInstituicoes()
  }

  recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 10;
    this.filtro.search = '';
    this.buscarInstituicoes();
  }
}
