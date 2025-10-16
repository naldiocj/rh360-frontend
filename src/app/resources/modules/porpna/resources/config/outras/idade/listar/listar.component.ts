import { Component, OnInit } from '@angular/core';
import { ModalService } from '@core/services/config/Modal.service';
import { IdadeService } from '@resources/modules/porpna/core/service/config/other/idade.service';

import { Pagination } from '@shared/models/pagination';

@Component({
  selector: 'porpna-listar-idade',
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

  public idades: any = []
  public idade: any
  public id: any
  constructor(private idadeService: IdadeService, private modalService: ModalService) { }

  ngOnInit(): void {
    this.buscarIdade()
  }

  private buscarIdade() {
    this.idades = this.idadeService.listar(this.filtro).pipe().subscribe({
      next: (response: any) => {
        this.idades = response.data

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

    this.setIdadeNull()
    this.setNullId()
    this.buscarIdade()
  }


  public setIdade(item: any) {
    this.idade = item;
  }

  public setIdadeNull() {
    this.idade = null
  }

  public setId(id: any) {
    this.id = id;
  }

  public setNullId() {
    this.id = null
  }

  public getGenero(genero: any) {
    return genero == "M" ? "Masculino" : genero == "F" ? "Femenino" : " "
  }


  public eliminarItem(id: any) {
    this.idadeService.eliminar(id).pipe().subscribe({
      next: () => {
        this.modalService.fechar('btn-del-idade')
        this.recarregarPagina()
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
    this.buscarIdade()
  }
  trackByFn(item:any) {
    return item.id;
  }

  public habilitarItem(id: any) {
    // this.alturaService.activar(id).pipe().subscribe({
    //   next: () => {
    //     this.modalService.fechar('btn-del-altura')
    //     this.recarregarPagina()
    //   }
    // })
  }
}
