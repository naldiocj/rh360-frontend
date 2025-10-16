import { Component, Input, OnInit } from '@angular/core';

import { Pagination } from '@shared/models/pagination';
import { OrgaoService } from '@core/services/config/Orgao.service';

@Component({
  selector: 'app-sigpq-colocacao',
  templateUrl: './colocacao.component.html',
  styleUrls: ['./colocacao.component.css']
})
export class ColocacaoComponent implements OnInit {

  totalBase: number = 0
  @Input() colocacao: any
  public pagination = new Pagination()
  colocoes: Array<any> = []

  filtro = {
    page: 1,
    perPage: 5,
    search: ""
  }

  constructor(
    private colocacaoService: OrgaoService
  ) { }

  ngOnInit(): void {
    // this.buscarColocacao()
  }

  buscarColocacao() {
    const option = {
      ...this.filtro,
      pessoaFisicaId: this.getPessoaId
    }
    this.colocacaoService.
      listarTodos(this.filtro)
      .subscribe((response) => {
        // console.log(response,'ppppppppppppppp');

        //     this.colocoes = response.data;

        //     this.totalBase = response.meta.current_page ?
        //       response.meta.current_page === 1 ? 1
        //         : (response.meta.current_page - 1) * response.meta.per_page + 1
        //       : this.totalBase;

        //     this.pagination = this.pagination.deserialize(response.meta);
      })
  }

  filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    // this.buscarColocacao()
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    // this.buscarColocacao()
  }

  public get getPessoaId() {
    return 1 as number
  }

}
