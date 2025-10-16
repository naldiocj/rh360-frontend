import { Component, OnInit } from '@angular/core';
import { GuiaService } from '../../core/service/guia.service';
import { FormBuilder } from '@angular/forms';
import { catchError, finalize } from 'rxjs';
import { Pagination } from '@shared/models/pagination';

@Component({
  selector: 'app-listar-guia',
  templateUrl: './listar-guia.component.html',
  styleUrls: ['./listar-guia.component.css'],
})
export class ListarGuiaComponent implements OnInit {
  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;

  public items: any;
  public id: number = 0;
  public showItems: any
  public filtro = {
    page: 1,
    perPage: 10,
    search: "",
  };
  constructor(private guia: GuiaService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.start();


    console.log(this.filtro.search)
  }
  public start() {
    const options = { ...this.filtro };
    this.guia.filtrar().subscribe((e) => {
      this.items = e;
      console.log(e);
    });

    this.guia
    .listar(options)
    .pipe(finalize(() => {}))
    .subscribe((response) => {
      this.items = response.data;
      this.pagination = this.pagination.deserialize(response.meta);
      this.totalBase = response.meta.current_page
        ? response.meta.current_page === 1
          ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);
    });
  }

  public editar(id: number, content: any) {
    this.guia
      .actualizar(id, content)
      .pipe(
        catchError((e): any => {
          console.log('erro ao editar, error name:', e.name);
        })
      )
      .subscribe((d) => {
        console.log('done');
        return null;
      });
  }

  public setId(id: number) {
    this.id = id;
   // console.log(id);
  }

  public setItems(data: any) {
    this.showItems = data;
    console.log(data);
  }
  public get GetId() {
    return this.id;
  }

  public delete() {
    this.guia
      .deletar(this.GetId)
      .pipe(
        catchError((e): any => {
          console.error('erro ao deletar items, error name:', e.name);
        })
      )
      .subscribe((e) => {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      });
  }
  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 10;
    this.filtro.search = "";
  }
  public filtrarPagina(key: any, $e: any) {
    if (key == "page") {
      this.filtro.page = $e;
    } else if (key == "perPage") {
      this.filtro.perPage = $e.target.value;
    } else if (key == "search") {
      this.filtro.search = $e;
    }
    this.start()
   // this.mostrar_organicas(this.filtro.search);
  }
}
