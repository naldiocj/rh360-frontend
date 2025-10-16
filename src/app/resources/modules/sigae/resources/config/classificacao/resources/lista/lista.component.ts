import { Component, OnInit } from '@angular/core';
import { ClassificacaoArmasService } from '@resources/modules/sigae/core/service/classificacao-armas.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  public classes: any = [];

  public pagination = new Pagination();
  public totalBase: number = 0;
  public marca: any;
  public id: any;
  public carregando:boolean = false 

  filtro = {
    page: 1,
    perPage: 10,
    search: "",
  };

  constructor(private classService:ClassificacaoArmasService) {}

  ngOnInit(): void {
    this.buscarClasses();
  }

  private buscarClasses() {
    const options = { ...this.filtro };

    // this.isLoading = true;
    this.classService
      .listar(options)
      .pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.classes = response?.data;
        this.pagination = this.pagination.deserialize(response.meta);

        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 10;
    this.filtro.search = "";
    this.buscarClasses();
    this.nullClass()
  }

  public filtrarPagina(key: any, $e: any) {
    if (key == "page") {
      this.filtro.page = $e;
    } else if (key == "perPage") {
      this.filtro.perPage = $e.target.value;
    } else if (key == "search") {
      this.filtro.search = $e;
    }

    this.buscarClasses();
  }


  public nullClass() {
    this.id = null;
  }

  public setId(id: any) {
    this.id = id;
  }

  public delete_(id: any) {
    this.carregando =  false
    this.classService
      .deletar(id)
      .pipe(
        finalize((): void => {
          this.carregando = true;
        })
      )
      .subscribe({
        next: () => {
          this.removeModal();
          this.recarregarPagina()
        },
      });
  }

  private removeModal() {
    $(".modal").hide();
    $(".modal-backdrop").hide();
  }
}
