import { Component, OnInit } from '@angular/core';
import { CalibreService } from '@resources/modules/sigae/core/service/calibre.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  public calibres: any = [];

  public pagination = new Pagination();
  public totalBase: number = 0;
  public id: any;
  public carregando:boolean = false 

  filtro = {
    page: 1,
    perPage: 10,
    search: "",
  };

  constructor(private calibreService:CalibreService) {}

  ngOnInit(): void {
    this.buscarCalibres();
  }

  private buscarCalibres() {
    const options = { ...this.filtro };

    // this.isLoading = true;
    this.calibreService
      .listar(options)
      .pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.calibres = response.data;
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
    this.buscarCalibres();
    this.nullCalibre()
  }

  public filtrarPagina(key: any, $e: any) {
    if (key == "page") {
      this.filtro.page = $e;
    } else if (key == "perPage") {
      this.filtro.perPage = $e.target.value;
    } else if (key == "search") {
      this.filtro.search = $e;
    }

    this.buscarCalibres();
  }


  public nullCalibre() {
    this.id = null;
  }

  public setId(id: any) {
    this.id = id;
  }

  public delete_(id: any) {
    this.carregando =  false
    this.calibreService
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
