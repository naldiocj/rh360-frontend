import { Component, OnInit } from '@angular/core';
import { ModalService } from '@core/services/config/Modal.service';
import { UnidadeService } from '@resources/modules/porpna/core/service/config/faa-unidade.service';
import { Pagination } from '@shared/models/pagination';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  public unidade: any
  public unidades: any
  public pagination = new Pagination();
  public id: any
  public totalBase: number = 0
  public filtro = {
    search: '',
    page: 1,
    perPage: 5
  }
  constructor(private unidadeService: UnidadeService, private modalService: ModalService) { }

  ngOnInit(): void {

    this.buscarUnidades()
  }

  public buscarUnidades() {
    this.unidadeService.listar(this.filtro).pipe().subscribe({
      next: (response: any) => {
        this.unidades = response.data

        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      }
    })
  }
  public filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarUnidades()
  }

  public recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''

    this.setNullUnidade()
    this.buscarUnidades()
    this.setNullId()

  }


  public setUnidade(item: any) {
    this.unidade = item;
  }

  public setNullUnidade() {
    this.unidade = null
  }

  public setId(id: any) {
    this.id = id;
  }

  public setNullId() {
    this.id = null;
  }

  public eliminarItem(id: any) {
    this.unidadeService.eliminar(id).pipe().subscribe({
      next: () => {
        this.modalService.abrir('btn-clone-eliminar')
        this.recarregarPagina()
      }
    })
  }
}
