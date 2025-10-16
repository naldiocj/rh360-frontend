import { Component, Input, OnInit } from '@angular/core';

import { Pagination } from '@shared/models/pagination';
import { MeioModel } from '@resources/modules/sigpq/shared/model/meio.model';
import { MeiosDistribuidosService } from '@resources/modules/sigpq/core/service/Meios-distribuidos.service';
 
@Component({
  selector: 'app-sigpq-meios-distribuidos',
  templateUrl: './meios-distribuidos.component.html',
  styleUrls: ['./meios-distribuidos.component.css']
})
export class MeiosDistribuidosComponent implements OnInit {

  totalBase: number = 0
  @Input() pessoaId: any = 5
  public pagination = new Pagination()
  meios: Array<MeioModel> = []

  filtro = {
    page: 1,
    perPage: 5,
    search: ""
  }

  constructor(
    private meiosDistribuidosService: MeiosDistribuidosService
  ) { }

  ngOnInit(): void {
    this.buscarMeiosDistribuidos()
  }

  buscarMeiosDistribuidos() {
    this.meiosDistribuidosService
      .listarMeiosDistribuidos(this.getPessoaId, this.filtro)
      .subscribe((response) => {
        
        this.meios = response.data;

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
    this.buscarMeiosDistribuidos()
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.buscarMeiosDistribuidos()
  }

  public get getPessoaId() {
    return this.pessoaId as number
  }

}
