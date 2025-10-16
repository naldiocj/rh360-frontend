import { Component, OnInit } from '@angular/core';
import { UtilizadorService } from '@core/services/config/Utilizador.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  public utentes: any = []
  public carregando: boolean = false;
  public pagination: Pagination = new Pagination()
  public totalBase: number = 0
  public id: any
  public utente: any

  public filtro: any = {
    search: '',
    page: 1,
    perPage: 10,
    modulo: 'Portal Ofical de Recrutamento da Policia Nacional de Angola'
  }
  constructor(private utilizador:UtilizadorService) { }


  ngOnInit(): void {

    this.buscarUtilizador();
  }


  private buscarUtilizador() {
    this.carregando = true;
    this.utilizador.listar(this.filtro).pipe(
      finalize((): void => {
        this.carregando = false;
      })
    ).subscribe({
      next: (response: any) => {
        this.utentes = response.data

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
    this.filtro.search = ''
    this.filtro.perPage = 10;
    this.filtro.modulo = 'Portal Ofical de Recrutamento da Policia Nacional de Angola'
    this.setNullId()
    this.setNullUtilizador()
  }

  public filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarUtilizador()
  }


  public setNullId() {
    this.id = null
  }

  public setUtente(item: any) {
    this.utente = item;
  }

  public setNullUtilizador() {
    this.utente = null
  }

  public setId(id:any){
    this.id =  id;
  }
}
