import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { RegimeService } from '@core/services/Regime.service';
import { PatenteService } from '@core/services/Patente.service';
import { FuncionarioService } from '@core/services/Funcionario.service';

import { Pagination } from '@shared/models/pagination';
import { Funcionario } from '@shared/models/Funcionario.model';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { TipoVinculoService } from '@resources/modules/sigpq/core/service/Tipo-vinculo.service';
import { Select2OptionData } from 'ng-select2';
import { finalize, first } from 'rxjs';
import { SecureService } from '@core/authentication/secure.service';
import { ActivatedRoute } from '@angular/router';
import { MobilidadeService } from '@resources/modules/sigpq/core/service/Mobilidade.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { TipoCarreiraOuCategoriaService } from '@resources/modules/sigpq/core/service/config/Tipo-carreira-ou-categoria.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { SituacaoEstadoService } from '@resources/modules/sigpq/core/service/config/Situacao-Estado.service';
import { EstadosParaFuncionario } from '@resources/modules/sigpq/core/service/config/Estados-para-Funcionario.service';
import { RelatorioLicencaService } from '../../../core/service/Relatorio-licenca.service';

@Component({
  selector: 'app-sigpq-mobilidade-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  public mobilidades: any[] = [];
  public numeroGuia: any = null

  public funcionarios: Funcionario[] = [];

  public estados = [{
    cor: 'rgb(254, 176, 25)',
    texto: 'Pendente'
  }, {
    cor: 'red',
    texto: 'Expirado',
  },
  {
    cor: 'rgb(0, 143, 251)',
    texto: 'Visto'
  }]

  public tipoVinculos: Array<Select2OptionData> = []
  public regimes: Array<Select2OptionData> = []
  public patenteClasses: Array<any> = []
  public patentes: Array<Select2OptionData> = []
  public tipoOrgaos: Array<Select2OptionData> = []
  public orgaos: Array<Select2OptionData> = []
  public mostrarCarreira = false;
  public situacaoEstados: Array<Select2OptionData> = [];
  public estado: Array<Select2OptionData> = []
  public tituloSituacao: string = ''
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public generos: Array<Select2OptionData> = [
    { id: 'null', text: 'Todos' },
    { id: 'M', text: 'Masculino' },
    { id: 'F', text: 'Feminino' }
  ]
  public isLoading: boolean = false
  public pagination = new Pagination();

  totalBase: number = 0

  filtro = {
    page: 1,
    perPage: 5,
    tipoOrgaoId: 'null',
    orgaoId: 'null',
    search: "",

  }
  agentesSelecionados: any = []

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }

  listarPDF: any = []

  constructor(
    private mobilidadeService: MobilidadeService,
    private ficheiroService: FicheiroService,
    private activatedRoute: ActivatedRoute,
    private relatorioService: RelatorioLicencaService,
    private sec: SecureService,
    private funcionarioServico: FuncionarioService,
    private tipoVinculoService: TipoVinculoService,
    private patenteService: PatenteService,
    private regimeService: RegimeService,
    private tipoCarreiraOuCategoriaService: TipoCarreiraOuCategoriaService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
    private situacaoEstadoService: SituacaoEstadoService,
    private estadosParaFuncionarioService: EstadosParaFuncionario,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService) {
    this.orgaos.push({
      id: 'null',
      text: 'Todos'
    })
  }

  ngOnInit() {
    // this.buscarPatentes()
    // this.buscarTipoVinculo()
    // this.validarBuscaDeAgentes()
    this.buscarRegimes()
    this.buscarSituacaoEstados()
    this.buscarTipoEstruturaOrganica()
    this.buscarMobilidade()
  }

  private buscarSituacaoEstados() {

    this.situacaoEstadoService.listarTodos({}).pipe().subscribe({
      next: (response: any) => {
        const aux = response.map((item: any) => ({ id: item.id, text: item.nome }))
        this.situacaoEstados = []
        this.situacaoEstados.push({
          id: 'null',
          text: 'Todos'
        })
        this.situacaoEstados.push(...aux)
      }
    })
  }
  private buscarTipoEstruturaOrganica() {
    this.estruturaOrganicaServico.listar({})
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {

        this.tipoEstruturaOrganicas = []
        this.tipoEstruturaOrganicas.push({
          id: 'null',
          text: 'Todos'
        })

        const org = response.map((item: any) => ({ id: item.sigla, text: item.name }))


        this.tipoEstruturaOrganicas.push(...org)

      })
  }

  buscarMobilidade() {

    this.isLoading = true;
    this.mobilidadeService.listar(this.filtro).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((response) => {
      this.mobilidades = response.data;


      this.totalBase = response.meta.current_page ?
        response.meta.current_page === 1 ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);
    });
  }

  buscarRegimes(): void {
    const opcoes = {}
    this.regimeService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {

        const aux = response.map((item: any) => ({ id: item.id, text: item.nome }))

        this.regimes = []
        this.regimes.push({
          id: 'null',
          text: 'Todos'
        })
        this.regimes.push(...aux)

      })
  }

  selecionarOrgaoOuComandoProvincial($event: any): void {
    if (!$event) return

    const opcoes = {
      tipo_estrutura_sigla: $event
    }
    this.direcaoOuOrgaoService.listarTodos(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.orgaos = []
        this.orgaos.push({
          id: 'null',
          text: 'Todos'
        })

        const org = response
          .map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
        this.orgaos.push(...org)
      })


    this.filtrarPagina('tipoOrgaoId', $event)
  }

  filtrarPagina(key: any, $e: any, reiniciar: boolean = true) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    } else if (key == 'tipoOrgaoId') {
      this.filtro.tipoOrgaoId = $e;
      this.filtro.orgaoId = 'null';
    } else if (key == 'orgaoId') {
      this.filtro.orgaoId = $e;
    }
    this.buscarMobilidade();
  }

  public selecionarSituacaoLaboral($event: any) {
    this.tituloSituacao = ''

    if (!$event) return
    const [situacao] = this.situacaoEstados.filter((item: any) => item.id == $event)
    if (!situacao) return

    this.tituloSituacao = situacao.text

    const options = {
      sigpq_situacao_estado_id: $event
    }

    this.estadosParaFuncionarioService.listarTodos(options).pipe().subscribe({
      next: (response: any) => {
        this.estado = []
        this.estado.push({
          id: 'null',
          text: 'Todos'
        })
        const aux = response.map((item: any) => ({ id: item.id, text: item.nome }))

        this.estado.push(...aux)
      }
    })
  }


  buscarTipoVinculo($event: any): void {
    this.mostrarCarreira = false;
    this.tipoVinculos = []
    if (!$event || $event == 'null') return


    if ($event == 1) {
      this.mostrarCarreira = true;
    } else {
      this.mostrarCarreira = false;
    }

    const [regime] = this.regimes
      .filter((item: any) => item.id == $event)

    const opcoes = {
      regime: regime?.text
    }
    let todos = true
    this.tipoVinculoService.listar(opcoes)
      .pipe(
        finalize((): void => {
          if ($event == 1) {
            this.tipoVinculos = this.tipoVinculos
              .filter((item: any) => item?.id == 1)
          }
        })
      )
      .subscribe((response: any): void => {
        this.tipoVinculos = []
        this.tipoVinculos.push({
          id: 'null',
          text: 'Todos'

        })
        const aux = response
          .map((item: any) => ({ id: item.id, text: item.nome }))

        this.tipoVinculos.push(...aux)
      })

    this.buscarTipoCarreiraOuCategoria($event)
  }

  private buscarTipoCarreiraOuCategoria(event: any): void {
    if (!event) return

    const opcoes = {
      regime_id: event
    }
    this.tipoCarreiraOuCategoriaService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {

        this.patenteClasses = []
        this.patenteClasses.push({
          id: 'null',
          text: 'Todos'
        })

        let aux: any = response.map((item: any) => ({ id: item.id, text: item.nome }))
        this.patenteClasses.push(...aux)

      })
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.tipoOrgaoId = 'null'
    this.filtro.orgaoId = 'null'
    this.filtro.search = ""
    this.buscarMobilidade()
  }

  selecionarAgenteParaMobilidade(item: any) {
    const conjuntoUnico = new Set(this.agentesSelecionados)
    const index = conjuntoUnico.has(item)
    if (!index) {
      conjuntoUnico.add(item);
    } else {
      conjuntoUnico.delete(item);
    }
    this.agentesSelecionados = Array.from(conjuntoUnico);
  }

  validarSelecionado(id: number | undefined) {
    const numeroUmExiste = this.agentesSelecionados.find((o: any) => o.id == id);
    if (numeroUmExiste) return true
    return false
  }

  limparVariaveis() {
    this.agentesSelecionados = []
  }

  construcao() {
    alert('Em construção')
  }

  get getAuth() {
    return this.sec.getTokenValueDecode()

  }
  public get moverAgentes(): boolean {
    return this.agentesSelecionados.length > 0
  }


  public maisAgentes(): boolean {
    return this.moverAgentes && this.agentesSelecionados.length > 1
  }

  showModal(modalName:string) {
    const modal = document.getElementById(modalName);
    if (modal) {
      modal.style.display = 'block';

    }
  }

  closeModal(modalName:string) {
    const modal = document.getElementById(modalName);
    if (modal) {
      modal.style.display = 'none'; // Fecha o modal
    }
  }

  visualizar(item: any) {


    this.listarPDF = []
    this.visualizarDocumento(item)
    // this.isLoading = true;
    /* this.mobilidadeService.listarTodos({ numero_guia: item?.numero_guia }).pipe(
      finalize(() => {
        // this.isLoading = false;
      })
    ).subscribe((response) => {
      // this.funcionarios = response.data;
      this.listarPDF = response
      console.log("Dados Recuperados:",response)
      // this.listarPDF = response[0]
      // this.totalBase = response.meta.current_page ?
      //   response.meta.current_page === 1 ? 1
      //     : (response.meta.current_page - 1) * response.meta.per_page + 1
      //   : this.totalBase;

      // this.pagination = this.pagination.deserialize(response.meta);
    }); */
  }


  public formatarGuia(guia: any) {

    return guia?.toString()?.trim()
  }

  //   public setMobilidade(numero_guia)

  // }

  public setMobilidade(numeroGuia: any) {
    this.numeroGuia = numeroGuia
  }
  fileUrl:any;
  carregando:boolean=false
  visualizarDocumento(item:any)
   {
    this.carregando=true
     /*  this.gerarDocumentoParaLicencaDoTipo=type
      this.showModal('modalVisualizarFichaDoEfectivoComBaseALicenca')
      this.licenca_disciplinarComponent.atualizarTodosOsDados() */
      this.showModal('modalGerarRelarorio')
      const options = {
        ...this.filtro,
        numero_guia: item.numero_guia
      }
      this.relatorioService.gerarModeloTransferencia(options)
            .pipe(
              first(),
              finalize(() => {
                this.carregando = false;
              })
            ).subscribe((response:any) => {
              this.fileUrl = this.relatorioService.createImageBlob(response);

            });
   }

  fecharModalRelatorio() {
    this.fileUrl = null
    this.relatorioService.cancelarGeracaoRelatorio()
  }

}
