import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProdutoPlanosInternoService } from '@resources/modules/sigv-version2/core/plano/produto-planos-interno.service';
import { MeiosPlanoDeNecessidadesService } from '@resources/modules/sigvestuario/core/planos/meios-plano-de-necessidades.service';
import { PlanosInternoService } from '@resources/modules/sigv-version2/core/plano/planos-interno.service';
import { MeiosPlanoDeDistribuicaoService } from '@resources/modules/sigvestuario/core/planos/meios-plano-de-distribuicao.service';

import { CategoriaService } from '@resources/modules/sigv-version2/core/categoria/categoria.service';
import { Observable, finalize } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from '@shared/models/pagination';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-meios',
  templateUrl: './listar-meios.component.html',
  styleUrls: ['./listar-meios.component.css']
})
export class ListarMeiosComponent implements OnInit {
  public produtos: any[] = []; // var que armazena a lista dos produtos que vem da API
  public produto: any = null;
  public planificacao: any;
  public categorias: any = [];
  public isLoading = false;
  public totalBase: number = 0;
  public pagination = new Pagination();
  public num = 0; //número do abastecimento que está ser utilizado na rota(url)
  filtro = {
    page: 1,
    perPage: 10,
    regime: 1,
    search: '',
    plano_id: 1,
    nome_calorico: ''
  };

  constructor(
    private produtoPlanosInternoService: ProdutoPlanosInternoService,
    private meios_plano_de_necessidades_service: MeiosPlanoDeNecessidadesService,
    private meios_plano_de_distribuicao_service: MeiosPlanoDeDistribuicaoService,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private plano_interno_service: PlanosInternoService
  ) { }

  ngOnInit(): void {
    this.getCategorias()
    this.buscarProdutos();
    this.buscarUmPlano();
  }

  private async getCategorias() {
    await this.categoriaService
      .listar(this.filtro)
      .pipe(
        finalize((): void => {
          //this.loadingPage = true;
        })
      )
      .subscribe({
        next: (response: any) => {
          //this.isLoading = true;
          //this.tam = Object.keys(response.data).length;
          this.categorias = response.data;
          console.log(JSON.stringify(response))
          console.log(JSON.stringify(response.data))
          /* this.totalBase = response.meta.current_page
            ? response.meta.current_page === 1
              ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;
          this.pagination = this.pagination.deserialize(response.meta); */
        },
      });
  }

  private async buscarProdutos() {
    const plano_id = this.route.snapshot.params["id"] as number //para o angular 14, usamos essa forma para pegar o parâmetro da url
    this.num = plano_id; //preencher o valor para tela
    this.filtro.plano_id = plano_id

    await this.meios_plano_de_distribuicao_service
      .listarUm(this.filtro, plano_id)
      .pipe(
        finalize((): void => {
          this.isLoading = true;
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('valores dos produtos' + response.data)
          this.produtos = response.data;
          /* this.produtos = response.filter((item: any)=> item.plano_id == this.num) */
          console.log(response);

          this.totalBase = response.meta.current_page
            ? response.meta.current_page === 1
              ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;
          this.pagination = this.pagination.deserialize(response.meta);
        },
      });
  }

  private async buscarUmPlano() {
    await this.plano_interno_service.listarUm('', this.num)
      .subscribe((response: any) => {
        this.planificacao = response;
      })
  }

  //secção atualizar página
  recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.search = "";
    this.buscarProdutos();
    this.clearItem();
  }

  filtrarPagina(key: any, $e: any, reiniciar: boolean = true) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    } else if (key == 'nome_calorico') {
      if ($e.target.value == 'categoria') {
        this.filtro.nome_calorico = '';
        this.buscarProdutos();
      }
      else
        this.filtro.nome_calorico = $e.target.value;
    }

    if (reiniciar) {
      this.filtro.page = 1
    }

    this.buscarProdutos();
  }

  setItem(item: any) {
    this.produto = item;
  }

  clearItem() {
    this.produto = null;
  }


  validarEliminar(item: any) {
    Swal.fire({
      title: "Eliminar?",
      html: `Pretende eliminar <b>${item.nome_produto} </b>? Esta acção não poderá ser revertida!`,
      icon: "warning",
      cancelButtonText: 'Cancelar',
      // timer: 2000,
      showCancelButton: true,
      confirmButtonText: "Sim, Eliminar!",
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary px-2 mr-1',
        cancelButton: 'btn btn-danger ms-2 px-2',
      },
    }).then((result: any) => {

      if (result.value) {
        this.excluirUmPlano(item.id)
      }

    })
  }

  excluirUmPlano(id: number) {
    this.produtoPlanosInternoService.eliminar(id).subscribe({
      next: (response) => {
        this.buscarProdutos();
      },
      error: (err) => {
        console.error("Falha ao excluir produto!");
      },
      complete: () => { }
    });
  }

}