import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/authentication/auth.service';
import { SecureService } from '@core/authentication/secure.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { PatenteService } from '@core/services/Patente.service';
import { RegimeService } from '@core/services/Regime.service';
import { EstadosParaFuncionario } from '@resources/modules/sigpq/core/service/config/Estados-para-Funcionario.service';
import { SituacaoEstadoService } from '@resources/modules/sigpq/core/service/config/Situacao-Estado.service';
import { TipoCarreiraOuCategoriaService } from '@resources/modules/sigpq/core/service/config/Tipo-carreira-ou-categoria.service';
import { PropostaProvimentoService } from '@resources/modules/sigpq/core/service/PropostaProvimento.service';
import { TipoVinculoService } from '@resources/modules/sigpq/core/service/Tipo-vinculo.service';
import { UtilService } from '@resources/modules/sigpq/core/utils/util.service';
import { Pagination } from '@shared/models/pagination';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { AppConfig } from '../../../../../../../config/app.config'

@Component({
  selector: 'app-agentes-propostos',
  templateUrl: './agentes-propostos.component.html',
  styleUrls: ['./agentes-propostos.component.css']
})
export class AgentesPropostosComponent implements OnInit {

  public propostas: any;
  public funcionarios: any = [];
  public trataProposta: any = null
  public mostrarCarreira = false;
  public tipoVinculos: Array<Select2OptionData> = []
  public regimes: Array<Select2OptionData> = []
  public patenteClasses: Array<any> = []
  public patentes: Array<Select2OptionData> = []
  public tipoOrgaos: Array<Select2OptionData> = []
  public orgaos: Array<Select2OptionData> = []
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
    regimeId: 'null',
    patenteId: 'null',
    patenteClasse: 'null',
    tipoVinculoId: 'null',
    tipoOrgaoId: 'null',
    situacaoId: 'null',
    estadoId: 'null',
    orgaoId: 'null',
    genero: 'null',
    search: "",

  }

  tituloPrincipal = AppConfig.orgName; /* Ex: Policia Nacional de Angola OU Serviços  I ... */
  introApp = AppConfig.introApp; /* Ex: Sistema Integrado de Gestao de pessoal e quadros */
  siglaPrincipal = AppConfig.siglaPrincipal; /* Ex: PNA */
  logoPath = AppConfig.logoPath; /* Ex: LOGOTIPO */
  logoBack = AppConfig.logoBack; /* Ex: LOGOTIPO DE FUNDO */
  useColor = AppConfig.useColor; /* Ex: COR DO TEMA */

  agentesSelecionados: any = []

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }

  listarPDF: any = []

  constructor(
    private propostaProvimento: PropostaProvimentoService,
    private activatedRoute: ActivatedRoute,
    private sec: SecureService,
    private tipoVinculoService: TipoVinculoService,
    private patenteService: PatenteService,
    private situacaoEstadoService: SituacaoEstadoService,
    private regimeService: RegimeService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private estadosParaFuncionarioService: EstadosParaFuncionario,
    private utilService: UtilService,
    public authService: AuthService,
    private router: Router,
    private tipoCarreiraOuCategoriaService: TipoCarreiraOuCategoriaService) {
    this.orgaos.push({
      id: 'null',
      text: 'Todos'
    })
  }

  ngOnInit() {
    this.buscarPropostas()
    this.buscarRegimes();
    // this.buscarClasses()
    this.buscarSituacaoEstados()
    this.buscarTipoEstruturaOrganica()
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

  buscarPropostas() {

    this.isLoading = true;
    this.propostaProvimento.listarTodos({ numero: this.getNumero }).pipe(
      finalize(() => {
        this.isLoading = false;
        if (!this.propostas) {
          this.router.navigate(['/piips/sigpg/provimento/propostas/listar']);
        }
        this.buscarAgentes()
      })
    ).subscribe({
      next: (response: any) => {
        this.propostas = response[0];


      }
    });
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
  public buscarAgentes() {

    this.isLoading = true;
    const options = {
      ...this.filtro,
      numero_guia: this.propostas?.numero
    }
    this.propostaProvimento.listarPorGuia(options).pipe(
      finalize((): void => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (response: any) => {
        this.funcionarios = response.data;



        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      }
    })
  }

  buscarRegimes(): void {
    const opcoes = {}
    let todos = true
    this.regimeService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.regimes = []
        this.regimes.push({
          id: 'null',
          text: 'Todos'
        })

        const aux = response.map((item: any) => ({ id: item.id, text: item.nome }));
        this.regimes.push(...aux)
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
    } else if (key == 'regimeId') {
      this.filtro.regimeId = $e;
      this.buscarTipoVinculo($e);
    } else if (key == 'patenteId') {
      this.filtro.patenteId = $e;
    } else if (key == 'tipoVinculoId') {
      this.filtro.tipoVinculoId = $e;
    } else if (key == 'tipoOrgaoId') {
      this.filtro.tipoOrgaoId = $e;
      this.filtro.orgaoId = 'null';
    } else if (key == 'orgaoId') {
      this.filtro.orgaoId = $e;
    } else if (key == 'genero') {
      this.filtro.genero = $e;
    } else if (key == 'patenteClasse') {
      this.filtro.patenteClasse = $e;
      this.buscarPatentes($e)
    } else if (key == 'situacaoId') {
      this.filtro.situacaoId = $e
      this.selecionarSituacaoLaboral($e)
    } else if (key == 'estadoId') {
      this.filtro.estadoId = $e
    }

    this.buscarAgentes();
  }

  public selecionarSituacaoLaboral($event: any) {
    this.tituloSituacao = ''

    if (!$event || $event == 'null') return
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

  private buscarPatentes($event: any) {
    if (!$event || $event == 'null') return

    const options = {
      sigpq_tipo_carreira_id: $event,
    }

    this.patenteService.listar(options).
      pipe()
      .subscribe((response: any): void => {

        const aux = response
          .map((item: any) => ({ id: item.id, text: item.nome }))
        this.patentes = []
        this.patentes.push({
          id: 'null',
          text: 'Todos'
        })

        this.patentes.push(...aux)

      })
  }


  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.regimeId = 'null'
    this.filtro.patenteId = 'null'
    this.filtro.patenteClasse = 'null'
    this.filtro.tipoVinculoId = 'null'
    this.filtro.tipoOrgaoId = 'null'
    this.filtro.situacaoId = 'null'
    this.filtro.estadoId = 'null'
    this.filtro.orgaoId = 'null'
    this.filtro.genero = 'null'
    this.filtro.search = ""
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
  public get proporAgentes(): boolean {
    return this.agentesSelecionados.length > 0
  }


  public maisAgentes(): boolean {
    return this.proporAgentes && this.agentesSelecionados.length > 1
  }

  visualizar(item: any) {

    // console.log(item);

    this.listarPDF = item

    // // this.isLoading = true;
    // this.propostaProvimento.listarTodos({ numero: item?.numero }).pipe(
    //   finalize(() => {
    //     // this.isLoading = false;
    //   })
    // ).subscribe((response: any) => {
    //   // this.funcionarios = response.data;
    //   this.listarPDF = response

    //   console.log(response)
    //   // this.listarPDF = response[0]
    //   // this.totalBase = response.meta.current_page ?
    //   //   response.meta.current_page === 1 ? 1
    //   //     : (response.meta.current_page - 1) * response.meta.per_page + 1
    //   //   : this.totalBase;

    //   // this.pagination = this.pagination.deserialize(response.meta);
    // });
  }

  public get getNumero() {
    return this.activatedRoute.snapshot.params['numero']
  }

  public get getMaisAgentes() {
    return this.propostas?.total > 1
  }


  public setTrataProposta(item: any) {
    this.trataProposta = item;

  }

  public recarregarTodos() {
    this.setTrataProposta(null)
    this.buscarPropostas()
  }

  public getPendente(key: any) {

    return this.utilService.tratamentoPedente(key)
  }

  public getExpedira(key: any) {

    return this.utilService.tratamentoExp(key)
  }

  validarEliminar(item: any) {

    Swal.fire({
      title: "Eliminar?",
      html: `Pretende eliminar <b>${item.nome_completo} </b>? Esta ação não poderá ser revertida!`,
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
        this.eliminar(item.sigpq_proposta_provimento_id)
      }

    })
  }

  eliminar(id: number) {
    this.isLoading = true;
    console.log(id)
    this.propostaProvimento.eliminar(id).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(({
      next: () => {
        this.filtrarPagina('page', 1)
        this.buscarPropostas()
      }
    }))
  }
}
