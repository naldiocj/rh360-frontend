import { Component, OnInit } from '@angular/core';
import { CandidatoService } from '@resources/modules/porpna/core/service/candidato.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  public candidatos: any = []
  public carregando: boolean = false;
  public pagination: Pagination = new Pagination()
  public totalBase: number = 0
  public id: any
  public candidato: any

  public filtro: any = {
    search: '',
    page: 1,
    perPage: 10,
    modulo: 'PORPNA'
  }
  constructor(private candidatoService: CandidatoService) { }
  ngOnInit(): void {
    this.buscarCandidatos();
  }


  private buscarCandidatos() {
    this.carregando = true;
    this.candidatoService.listar(this.filtro).pipe(
      finalize((): void => {
        this.carregando = false;
      })
    ).subscribe({
      next: (response: any) => {
        this.candidatos = response.data
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
    this.filtro.modulo = 'PORPNA'
    this.setNullId()
    this.setNullCandidato()
  }

  public filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarCandidatos()
  }


  public setNullId() {
    this.id = null
  }

  public setCandidato(item: any) {
    this.candidato = item;

    console.log(item)
  }

  public setNullCandidato() {
    this.candidato = null
  }

  public setId(id: any) {
    this.id = id;
  }

}