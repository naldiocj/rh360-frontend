import { Component, OnInit } from '@angular/core';
import { ModalService } from '@core/services/config/Modal.service';
import { RamoService } from '@resources/modules/porpna/core/service/config/faa-ramo.service';
import { Pagination } from '@shared/models/pagination';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  public ramo: any
  public ramos: any
  public pagination = new Pagination();
  public id: any
  public totalBase: number = 0
  public filtro = {
    search: '',
    page: 1,
    perPage: 5
  }
  constructor(private ramoService: RamoService, private modalService: ModalService) { }

  ngOnInit(): void {

    this.buscarRamo()
  }

  public buscarRamo() {
    this.ramoService.listar(this.filtro).pipe().subscribe({
      next: (response: any) => {
        this.ramos = response.data

        console.log(response)

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
    this.buscarRamo()
  }

  public recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''

    this.setNullRamo()
    this.buscarRamo()
    this.setNullId()

  }


  public setRamo(item: any) {
    this.ramo = item;
  }

  public setNullRamo() {
    this.ramo = null
  }

  public setId(id: any) {
    this.id = id;
  }

  public setNullId() {
    this.id = null;
  }

  public eliminarItem(id: any) {
    this.ramoService.eliminar(id).pipe().subscribe({
      next: () => {
        this.modalService.abrir('btn-clone-eliminar')
        this.recarregarPagina()
      }
    })
  }
}
