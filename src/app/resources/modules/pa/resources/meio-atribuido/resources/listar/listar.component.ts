import { Component, OnInit } from '@angular/core';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { AgenteService } from '@resources/modules/pa/core/service/agente.service';
import { MeiosDistribuidosService } from '@resources/modules/sigpq/core/service/Meios-distribuidos.service';
import { MeioModel } from '@resources/modules/sigpq/shared/model/meio.model';
import { Pagination } from '@shared/models/pagination';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  totalBase: number = 0
  public pagination = new Pagination()
  meios: Array<MeioModel> = []

  filtro = {
    page: 1,
    perPage: 5,
    search: ""
  }

  constructor(
    private meiosDistribuidosService: MeiosDistribuidosService,
    private agenteService: AgenteService,
    private utilService: UtilService
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
    return this.agenteService.id as number
  }

  public getEstado(status: any): any {
    return status == true ? this.utilService.estado('E') : this.utilService.estado('R')
  }


}
