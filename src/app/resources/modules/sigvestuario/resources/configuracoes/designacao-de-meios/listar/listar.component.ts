import { Component, OnInit } from '@angular/core';
import { DesignacaoDeMeiosService } from '@resources/modules/sigvestuario/core/meios/designacao-de-meios.service';
import { TipoDeMeiosService } from '@resources/modules/sigvestuario/core/meios/tipo-de-meios.service';
import { finalize } from 'rxjs';
import { Pagination } from '@shared/models/pagination';
import Swal from 'sweetalert2';

@Component({
  selector: 'sigvest-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  public categorias: any = [];
  public designacao_de_meios: any = [];
  public descricaoProduto: any = null;
  public loadingPage = false;
  public totalBase: number = 0;
  public pagination = new Pagination();

  public filtro = {
    page: 1,
    perPage: 10,
    regime: 1,
    search: '',
    nome_calorico: ''
  };

  constructor(
    private tipo_de_meios_service: TipoDeMeiosService,
    private designacao_de_meios_service: DesignacaoDeMeiosService,
  ) { }

  ngOnInit(): void {
    this.buscarDesignacaoDeMeios();
    this.buscarTipoDeMeios();
  }

  //pegando a lista das descrições da minha api
  private async buscarDesignacaoDeMeios() {
    await this.designacao_de_meios_service
      .listar(this.filtro)
      .pipe(
        finalize((): void => {
          this.loadingPage = true;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.designacao_de_meios = response.data;
          this.totalBase = response.meta.current_page
            ? response.meta.current_page === 1
              ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;
          this.pagination = this.pagination.deserialize(response.meta);
        },
      });
  }

  private buscarTipoDeMeios() {
    this.tipo_de_meios_service.listar('')
      .subscribe((response) => {
        this.categorias = response
      })
  }

  public recarregarPagina(): void {
    this.filtro.page = 1;
    this.filtro.search = "";
    this.filtro.nome_calorico = "";
    this.buscarDesignacaoDeMeios();
    this.clearItem();
  }

  public limparValores(): void {
    this.clearItem()
  }

  public setItem(item: any, filtro: any): void {
    if (filtro == 'detalhe')
      this.descricaoProduto = item;
    if (filtro == 'registar')
      this.descricaoProduto = item;
  }

  public clearItem(): void {
    this.descricaoProduto = null;
  }

  public validarEliminar(item: any) {
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
        this.eliminarUmMeio(item.id)
      }

    })
  }

  private eliminarUmMeio(id: number): void {
    this.designacao_de_meios_service.eliminar(id).subscribe({
      next: (response) => {
        this.buscarDesignacaoDeMeios();
      },
      error: (err) => {
        console.error("Falha ao excluir produto!");
      },
      complete: () => { }
    });
  }

  filtrarPagina(key: any, $e: any, reiniciar: boolean = true) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'nome_calorico') {
      this.filtro.nome_calorico = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }

    if (reiniciar) {
      this.filtro.page = 1
    }

    this.buscarDesignacaoDeMeios();
  }
}