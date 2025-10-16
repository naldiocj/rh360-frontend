import { Component, OnInit } from '@angular/core';
import { PlanoDeNecessidadesService } from '@resources/modules/sigvestuario/core/planos/plano-de-necessidades.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { Select2OptionData } from 'ng-select2';
import { SecureService } from '@core/authentication/secure.service';
import { DashboardService } from '@resources/modules/sigv-version2/core/dashboard/dashboard.service';
import { PlanoService } from '@resources/modules/sigv-version2/core/plano/plano.service';


@Component({
  selector: 'sigvest-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  planificacaoInters: any = [];
  public pagination = new Pagination();
  public loadingPage = false;
  public totalBase: number = 0;
  public pesquisaAvancada: boolean = false;
  public fileUrl: any;
  public documento: any;
  public planificacao: any;
  public planificacao_para_modal_editar: any = null;
  public planificacao_para_modal_detalhe: any = null;
  public planificacao_para_modal_validar_plano: any = null;
  public planificacao_para_modal_ver_adenda: any = null;
  public gerar_planificacoes_colectivas: any = null;

  public rmm: Array<Select2OptionData> = [];
  public direcaoOuOrgao: Array<Select2OptionData> = [];
  public tipoPlano: Array<Select2OptionData> = [];

  options: any = {
    placeholder: 'Seleciona uma opção',
    width: '100%'
  };

  public filtro = {
    page: 1,
    perPage: 10,
    regime: 1,
    search: '',
    //escolha_departamento: this.orgao_id,
    //escolha_departamento_distribuicao: '',
    referencia_plano: '',
    ano_referencia_plano: '',
    orgao_recebe: '',
    quantidade_funcionario: '',
    fornecedor_id: '',
    data_inicial: '',
    data_final: '',
    estado_plano: ''
  };

  get orgao_id(): number {
    return this.secureService.getTokenValueDecode()?.orgao?.id;
  }

  constructor(
    private plano_de_necessidades_service: PlanoDeNecessidadesService,
    private secureService: SecureService,
    private dashboard_service: DashboardService,
    private plano_service: PlanoService
  ) { }

  ngOnInit(): void {
    this.buscarPlanos();
    this.buscarTipoPlano();
    this.buscarTodosOrgaosSubordinantes();
  }
  //pegando a lista dos abastecimentos da minha api
  private async buscarPlanos() {
    await this.plano_de_necessidades_service
      .listar(this.filtro)
      .pipe(
        finalize((): void => {
          //this.loadingPage = true;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.loadingPage = true;
          //console.log(JSON.stringify(response.data))
          this.planificacaoInters = response.data;
          this.totalBase = response.meta.current_page
            ? response.meta.current_page === 1
              ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;
          this.pagination = this.pagination.deserialize(response.meta);
        },
      });
  }

  async buscarTodosOrgaosSubordinantes() {
    await this.dashboard_service.listarDepartamento({}, this.orgao_id)
      .subscribe((response: any): void => {
        this.direcaoOuOrgao = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
      })
  }

  /* dados para os filtros */
  private async buscarTipoPlano(opcoes?: any) {
    const options = {
      ...opcoes,
    };
    await this.plano_service
      .listar(options)
      .subscribe((response: any): void => {
        this.tipoPlano = response.filter(
          (item: any) => (
            item.referencia_plano.toString() == 'PLANO I TRIMESTRE (JANEIRO,FEVEREIRO,MARÇO)' ||
            item.referencia_plano.toString() == 'PLANO II TRIMESTRE (ABRIL,MAIO,JULHO)' ||
            item.referencia_plano.toString() == 'PLANO III TRIMESTRE (JUNHO,AGOSTO,SETEMBRO)' ||
            item.referencia_plano.toString() == 'PLANO IIII TRIMESTRE (OUTUBRO,NOVEMBRO,DEZEMBRO)' ||
            item.referencia_plano.toString() == 'DOAÇÃO'
          ))
          .map((item: any) => ({
            id: item.referencia_plano,
            text: item.referencia_plano,
          }));

        console.log(this.tipoPlano)
      });
  }

  public async gerarPlano(plano: any) {
    let filtro = {
      plano_id: plano.id
    }
    await this.plano_de_necessidades_service.gerarPlano(filtro)
      .subscribe((response) => {
        this.fileUrl = this.plano_de_necessidades_service.createImageBlob(response);
      })
  }

  filtrarPagina(key: any, $e: any, reiniciar: boolean = true) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    } else if (key == 'referencia_plano') {
      this.filtro.referencia_plano = $e;
    } else if (key == 'fornecedor_id') {
      this.filtro.fornecedor_id = $e;
    } else if (key == 'data_inicial') {
      this.filtro.data_inicial = $e.target.value;
    } else if (key == 'data_final') {
      this.filtro.data_final = $e.target.value;
    } else if (key == 'escolha_departamento_distribuicao') {
      //this.filtro.escolha_departamento_distribuicao = $e;
    } else if (key == 'ano_referencia_plano') {
      this.filtro.ano_referencia_plano = $e.target.value;
    } else if (key == 'estado_plano') {
      if ($e.target.value == 'todos')
        this.filtro.estado_plano = '';
      else
        this.filtro.estado_plano = $e.target.value.toUpperCase();
    }

    if (reiniciar) {
      this.filtro.page = 1
    }

    this.buscarPlanos();
  }

  recarregarPagina() {
    this.buscarPlanos();
    this.clearItem()
  }

  validarEliminar(item: any) {
    Swal.fire({
      title: "Eliminar?",
      html: `Pretende eliminar <b>${item.id} </b>? Esta acção não poderá ser revertida!`,
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
        this.excluirUmaCategoria(item.id)
      }

    })
  }

  excluirUmaCategoria(id: any) {
    this.plano_de_necessidades_service.eliminar(id).subscribe({
      next: (response) => {
        this.buscarPlanos();
      },
      error: (err) => {
        console.error("Falha ao excluir produto!");
      },
      complete: () => { }
    });
  }

  public mostrarPesquisaAvancada(): void {
    this.pesquisaAvancada = !this.pesquisaAvancada;
  }

  setItem(tipo: any, item: any): void {
    if (tipo === 'ver-anexo')
      this.documento = item;

    else if (tipo === 'ver-detalhes') {
      let filtro = {
        ...item,
        tipo_plano: 'plano-pna-orgaos'
      }
      this.planificacao_para_modal_detalhe = filtro;
    }

    else if (tipo === 'editar') {
      let filtro = {
        ...item,
        tipo_editar: 'sigvest-plano-de-necessidades'
      }
      this.planificacao_para_modal_editar = filtro;
    }

    else if (tipo === 'validar-plano') {
      let filtro = {
        ...item,
        tipo: 'sigvest-plano-necessidades'
      }
      this.planificacao_para_modal_validar_plano = filtro;
    }

    else if (tipo === 'planoColectivo') {
      this.gerar_planificacoes_colectivas = item
    }

    else if (tipo === 'ver-adenda') {
      let filtro = {
        ...item,
        tipo_adenda: 'plano-pna-orgaos'
      }
      this.planificacao_para_modal_ver_adenda = filtro;
    }
  }

  clearItem(): void {
    this.documento = null;
    this.planificacao = null;
  }
}