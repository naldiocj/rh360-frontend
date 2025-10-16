import { Component, Input, OnInit } from '@angular/core';

import { ProvimentoService } from '@resources/modules/sigpq/core/service/Provimento.service';
import { Pagination } from '@shared/models/pagination';
import { ProvimentoModel } from '@resources/modules/sigpq/shared/model/provimento.model';
import { SecureService } from '@core/authentication/secure.service';

@Component({
  selector: 'app-pa-historico-provimento',
  templateUrl: './historico-provimento.component.html',
  styleUrls: ['./historico-provimento.component.css']
})
export class HistoricoProvimentoComponent implements OnInit {

  totalBase: number = 0
  @Input() pessoaId: any = 5
  public pagination = new Pagination()
  provimentos: Array<ProvimentoModel> = []

  filtro = {
    page: 1,
    perPage: 5,
    search: ""
  }

  constructor(
    private provimentoService: ProvimentoService,
    private secureService: SecureService
  ) { }

  ngOnInit(): void {
    this.buscarProvimento()
  }

  buscarProvimento() {
    this.provimentoService
      .listarTodos({ pessoa_id: this.getPessoaId, ...this.filtro })
      .subscribe((response) => {

        this.provimentos = response.data;

        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
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
    this.buscarProvimento()
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.buscarProvimento()
  }

  public get getPessoaId() {
    return this.secureService.getTokenValueDecode().pessoa?.id as number;
  }

}
