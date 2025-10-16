import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SecureService } from '@core/authentication/secure.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { PatenteService } from '@core/services/Patente.service';
import { RegimeService } from '@core/services/Regime.service';
import { ActoProgressaoService } from '@resources/modules/sigpq/core/service/config/Acto-Progressao.service';
import { EstadosParaFuncionario } from '@resources/modules/sigpq/core/service/config/Estados-para-Funcionario.service';
import { SituacaoEstadoService } from '@resources/modules/sigpq/core/service/config/Situacao-Estado.service';
import { TipoCarreiraOuCategoriaService } from '@resources/modules/sigpq/core/service/config/Tipo-carreira-ou-categoria.service';
import { ProvimentoService } from '@resources/modules/sigpq/core/service/Provimento.service';
import { TipoVinculoService } from '@resources/modules/sigpq/core/service/Tipo-vinculo.service';
import { Pagination } from '@shared/models/pagination';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit, OnDestroy {

  public provimentos: any[] = [];
  public numeroGuia: any = null
  private destroy$: Subject<void>;
  public numero: any | null = null

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }

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
  public actoProgressaos: Array<Select2OptionData> = []
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public generos: Array<Select2OptionData> = [
    { id: 'null', text: 'Todos' },
    { id: 'M', text: 'Masculino' },
    { id: 'F', text: 'Feminino' }
  ]
  public isLoading: boolean = false
  public pagination = new Pagination();

  public totalBase: number = 0


  emTempos: any[] = []
  emTempo: any

  filtro: any = {
    page: 1,
    perPage: 5,
    regimeId: 'null',
    patenteId: 'null',
    patenteClasse: 'null',
    search: "",
    dashboard: false,
    sigpq_acto_progressao_id: 'null'
  }

  constructor(
    private provimentoService: ProvimentoService,
    private ficheiroService: FicheiroService,
    private activatedRoute: ActivatedRoute,
    private sec: SecureService,
    private funcionarioServico: FuncionarioService,
    private patenteService: PatenteService,
    private tipoCarreiraOuCategoriaService: TipoCarreiraOuCategoriaService,
    private actoProgressaoService: ActoProgressaoService,
  ) {
    this.destroy$ = new Subject<void>()
  }

  ngOnInit(): void {

    this.buscarProvimentos()
    this.buscarActoProgressao()
    this.buscarTipoCarreiraOuCategoria()
  }

  public buscarActoProgressao(): void {
    const opcoes = {}
    this.actoProgressaoService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {

        this.actoProgressaos = []
        this.actoProgressaos.push({
          id: 'null',
          text: 'Todos'
        })

        let aux: any = response.map((item: any) => ({ id: item.id, text: item.nome }))
        this.actoProgressaos.push(...aux)
      })
  }
  private buscarProvimentos() {
    this.isLoading = true;
    this.provimentoService.listarTodos(this.filtro).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((response) => {
      this.provimentos = response.data;


      this.totalBase = response.meta.current_page ?
        response.meta.current_page === 1 ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);
    });
  }






  filtrarPagina(key: any, $e: any) {
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
    } else if (key == 'patenteClasse') {
      this.filtro.patenteClasse = $e;
      this.buscarPatentes($e)
    } else if (key == 'patenteId') {
      this.filtro.patenteId = $e;
    } else if (key == "tipoActo") {
      this.filtro.sigpq_acto_progressao_id = $e
    }
    this.buscarProvimentos();
  }


  private buscarTipoCarreiraOuCategoria(): void {


    const opcoes = {
      regime_id: 1
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
    this.filtro.patenteId = 'null'
    this.filtro.patenteClasse = 'null'
    this.filtro.sigpq_acto_progressao_id = 'null'

    this.buscarProvimentos()
  }


  get getAuth() {
    return this.sec.getTokenValueDecode()

  }

  private buscarPatentes($event: any) {
    if (!$event || $event == 'null') return

    const options = {
      sigpq_tipo_carreira_id: $event,

    }

    this.patenteService.listar(options)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {

        const aux = response.map((item: any) => ({ id: item.id, text: item.nome }))
        this.patentes = []
        this.patentes.push({
          id: 'null',
          text: 'Todos'
        })

        this.patentes.push(...aux)


      })

  }
  visualizar(item: any) {

    this.numero = item


    // this.listarPDF = []

    // // this.isLoading = true;
    // this.mobilidadeService.listarTodos({ numero_guia: item?.numero_guia }).pipe(
    //   finalize(() => {
    //     // this.isLoading = false;
    //   })
    // ).subscribe((response) => {
    //   // this.funcionarios = response.data;
    //   this.listarPDF = response
    //   // this.listarPDF = response[0]
    //   // this.totalBase = response.meta.current_page ?
    //   //   response.meta.current_page === 1 ? 1
    //   //     : (response.meta.current_page - 1) * response.meta.per_page + 1
    //   //   : this.totalBase;

    //   // this.pagination = this.pagination.deserialize(response.meta);
    // });
  }

  public formatarGuia(guia: any) {

    return guia?.toString()?.trim()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
