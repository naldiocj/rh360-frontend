import { Component, OnInit } from '@angular/core';
import { ModalService } from '@core/services/config/Modal.service';
import { AlturaService } from '@resources/modules/porpna/core/service/config/other/altura.service';
import { Pagination } from '@shared/models/pagination';

@Component({
  selector: 'porpna-listar-altura',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  public filtro: any = {
    page: 1,
    search: '',
    perPage: 5,
  }

  public totalBase: number = 0;
  public pagination: Pagination = new Pagination()

  public alturas: any = []
  public altura!: any
  public id: any
  constructor(private alturaService: AlturaService, private modalService: ModalService) { }

  ngOnInit(): void {
    this.buscarAltura()
  }

  private buscarAltura() {
    this.alturas = this.alturaService.listar(this.filtro).pipe().subscribe({
      next: (response: any) => {
        this.alturas = response.data

        console.log(response)

        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      }
    })
  }


  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = ""

    this.setAlturaNull()
    this.setNullId()
    this.buscarAltura()
  }


  public filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarAltura()
  }




  public setAltura(item: any) {
    this.altura = item;
  }


  public setAlturaNull() {
    this.altura = null
  }

  public setId(id: any) {
    this.id = id;
  }

  public setNullId() {
    this.id = null
  }

  public getGenero(genero: any) {
    return genero == "M" ? "Masculino" : genero == "F" ? "Femenino" : "F"
  }


  public eliminarItem(id: any) {
    this.alturaService.eliminar(id).pipe().subscribe({
      next: () => {
        this.modalService.fechar('btn-activar-altura')
        this.recarregarPagina()
      }
    })
  }

  public habilitarItem(id: any) {
    // this.alturaService.activar(id).pipe().subscribe({
    //   next: () => {
    //     this.modalService.fechar('btn-del-altura')
    //     this.recarregarPagina()
    //   }
    // })
  }

  trackByFn(item: any) {
    return item.id;
  }
}
