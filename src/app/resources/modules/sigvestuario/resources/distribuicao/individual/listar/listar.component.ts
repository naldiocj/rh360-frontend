import { Component, OnInit } from '@angular/core';
import { PlanoDotacaoService } from '@resources/modules/sigv-version2/core/plano/plano-dotacao.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { Select2OptionData } from 'ng-select2';
import { SecureService } from '@core/authentication/secure.service';
import { PreDespachoService } from '@resources/modules/sigvestuario/core/planos/pre-despacho.service';
import { PreDespachoIndividualService } from '@resources/modules/sigvestuario/core/planos/pre-despachoIndividual.service';
import { BeneficiariosService } from '@resources/modules/sigvestuario/core/pessoas/beneficiarios.service';

@Component({
  selector: 'sigvest-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  public planificacaoInters: any = [];
  public pre_despacho: any;  
  public documento: any;  
  public planificacao_para_modal_editar: any = null;
  public planificacao_para_modal_detalhe: any = null;
  public planificacao_para_modal_validar_plano: any = null;
  public planificacao_para_modal_ver_adenda: any = null;
  public gerar_planificacoes_colectivas: any = null;
  public pagination = new Pagination();
  public loadingPage = false;
  public totalBase: number = 0;
  public pesquisaAvancada: boolean = false;
  public dados_do_funcionario_ou_efectivo: any;
  public atribuir_meios_ao_efectivo_dados_do_agente: any;


  public rmm: Array<Select2OptionData> = [];
  
  options: any = {
    placeholder: 'Seleciona uma opção',
    width: '100%'
  };

  public filtro = {
    page: 1,
    perPage: 10,
    regime: 1,
    search: '',
    escolha_departamento: this.orgao_id,
    referencia_plano: '',
    ano_referencia_plano: '',
    estado_plano: ''
  };
  
  get orgao_id() {
    return this.secureService.getTokenValueDecode()?.orgao?.id;
  }

  constructor(
    private beneficiarios_service: BeneficiariosService,
    private secureService: SecureService
  ) { }
  
  ngOnInit(): void {
    this.buscarPlanoss();
    this.buscarPlanos();
  }

  //pegando a lista dos abastecimentos da minha api
  private async buscarPlanoss() {
    await this.beneficiarios_service
      .listar(this.filtro)
      .pipe(
        finalize((): void => {
          this.loadingPage = true;
        })
      )
      .subscribe({
        next: (response: any) => {
          //this.isLoading = true;
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

  private async buscarPlanos() {
    await this.beneficiarios_service
      .listar(this.filtro)
      .pipe(
        finalize((): void => {
          this.loadingPage = true;
        })
      )
      .subscribe({
        next: (response: any) => {
          //this.isLoading = true;
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

    this.buscarPlanos();
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
    }).then((result:any) => {

      if (result.value) {
        this.excluirUmaCategoria(item.id)
      }

    })
  }

  excluirUmaCategoria(id: any){
    this.beneficiarios_service.eliminar(id).subscribe({
      next: (response) => {
        this.buscarPlanos();
      },
      error: (err) =>{
        console.error("Falha ao excluir produto!");
      },
      complete: () => {}
    });
  }

  public mostrarPesquisaAvancada(): void {
    this.pesquisaAvancada = !this.pesquisaAvancada;
  }

  setItem(item: any, tipo?: any) {
    this.atribuir_meios_ao_efectivo_dados_do_agente = item;

    if (tipo === 'ver-anexo')
      this.documento = item;
    else if(tipo === 'exportar') {
      this.pre_despacho = item;
    }
    else if (tipo === 'ver-detalhes') {
      let filtro = {
        ...item,
        tipo_plano: 'plano-pna-dotacao'
      }
      this.planificacao_para_modal_detalhe = filtro;
    }
    else if (tipo === 'editar') {
      let filtro = {
        ...item,
        tipo_editar: 'plano-pna-dotacao'
      }
      this.planificacao_para_modal_editar = filtro;
    }
    else if (tipo === 'validar-plano') {
      let filtro = {
        ...item,
        tipo: 'plano-pna-dotacao'
      }
      this.planificacao_para_modal_validar_plano = filtro;
    } else if (tipo === 'planoColectivo') {
      this.gerar_planificacoes_colectivas = item
    } else if (tipo === 'ver-adenda') {
      let filtro = {
        ...item,
        tipo_adenda: 'plano-pna-dotacao'
      }
      this.planificacao_para_modal_ver_adenda = filtro;
    }
  }
  
  setItemTexte(item : any) {
    console.log(item)
    this.atribuir_meios_ao_efectivo_dados_do_agente = item;
  }

  clearItem() {
    this.pre_despacho = null;
    this.atribuir_meios_ao_efectivo_dados_do_agente = null;
  }

  recarregarPagina(){
    this.buscarPlanos();
    this.clearItem()
  }

  public adicionarOsDadosDoEfectivo(dados: any) {
    this.dados_do_funcionario_ou_efectivo = dados;
    //this.planificacaoForm.get('pessoajuridica_id')?.setValue(dados.id)
    console.log(dados);

  }
}