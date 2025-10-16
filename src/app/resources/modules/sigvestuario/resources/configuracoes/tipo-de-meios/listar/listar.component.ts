import { Component, OnInit } from '@angular/core';
import { TipoDeMeiosService } from '@resources/modules/sigvestuario/core/meios/tipo-de-meios.service';
import { Observable, finalize } from 'rxjs';
import { Pagination } from '@shared/models/pagination';
import Swal from 'sweetalert2';

@Component({
  selector: 'sigvest-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  public tipo_de_meios: any = [];
  public tipo_de_meios_para_modal_editar: any = null;
  public loadingPage = false;

  public totalBase: number = 0;
  public pagination = new Pagination();

  filtro = {
    page: 1,
    perPage: 10,
    regime: 1,
    search: '',
  };

  constructor(private tipo_de_meios_service: TipoDeMeiosService) {
  }

  ngOnInit(): void {
    this.buscarTipoDeMeios();
  }

  //pegando a lista dos abastecimentos da minha api
  private async buscarTipoDeMeios() {
    await this.tipo_de_meios_service
      .listar(this.filtro)
      .pipe(
        finalize((): void => {
          //this.loadingPage = true;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.loadingPage = true;
          this.tipo_de_meios = response.data;
          this.totalBase = response.meta.current_page
            ? response.meta.current_page === 1
              ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;
          this.pagination = this.pagination.deserialize(response.meta);
        },
      });
  }

  //secção atualizar página
  recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.search = "";
    this.buscarTipoDeMeios();
    this.clearItem();
  }

  filtrarPagina(key: any, $e: any, reiniciar: boolean = true) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }

    if (reiniciar) {
      this.filtro.page = 1
    }

    this.buscarTipoDeMeios();
  }

  setItem(tipo: any, item: any) {
    if (tipo === 'editar') {
      this.tipo_de_meios_para_modal_editar = item;
    }
  }

  clearItem() {
    this.tipo_de_meios_para_modal_editar = null;
  }

  validarEliminar(item: any) {
    Swal.fire({
      title: "Eliminar?",
      html: `Pretende eliminar <b>${item.nome} </b>? Esta acção não poderá ser revertida!`,
      icon: "warning",
      cancelButtonText: 'Cancelar',
      // timer: 2000,
      showCancelButton: true,
      confirmButtonText: "Sim, Eliminar!",
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-danger px-2 mr-1',
        cancelButton: 'btn btn-primary ms-2 px-2',
      },
    }).then((result: any) => {

      if (result.value) {
        this.excluirUmTipoDeMeios(item.id)
      }

    })
  }

  excluirUmTipoDeMeios(id: number) {
    this.tipo_de_meios_service.eliminar(id).subscribe({
      next: (response) => {
        this.buscarTipoDeMeios();
      },
      error: (err) => {
        console.error("Falha ao excluir produto!");
      },
      complete: () => { }
    });
  }
}