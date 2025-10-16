import { Component, Input, OnInit } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { PatenteService } from '@core/services/Patente.service';
import { RegimeService } from '@core/services/Regime.service';
import { PassesProfissionalService } from '@resources/modules/sigpq/core/service/Passes-Profissional.service';
import { TipoVinculoService } from '@resources/modules/sigpq/core/service/Tipo-vinculo.service';
import { Pagination } from '@shared/models/pagination';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  public: any[] = [];

  public passes: any[] = []

  public agente: any = null
  public imprimir: boolean = false;



  public tipoVinculos: Array<Select2OptionData> = []
  public regimes: Array<Select2OptionData> = []
  public patenteClasses: Array<any> = []
  public patentes: Array<Select2OptionData> = []

  public orgaos: Array<Select2OptionData> = []
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public situacaoEstados: Array<Select2OptionData> = [];
  public estado: Array<Select2OptionData> = []
  public tituloSituacao: string = ''
  public mostrarCarreira = false;

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
    orgaoId: 'null',
    genero: 'null',
    search: "",
    situacaoId: 'null',
    estadoId: 'null',

  }

  agentesSelecionados: any = []

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }

  listarPDF: any = []

  constructor(
    private sec: SecureService,
    private tipoVinculoService: TipoVinculoService,
    private patenteService: PatenteService,
    private regimeService: RegimeService,
    private passesService: PassesProfissionalService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService) {
    this.orgaos.push({
      id: 'null',
      text: 'Todos'
    })
  }

  ngOnInit() {
    this.buscarRegimes()
    // this.buscarPatentes()
    this.buscarTipoVinculo()
    // this.validarBuscaDeAgentes()
    this.buscarPasses()
  }

  private buscarPasses() {

    this.isLoading = true;
    this.passesService.listarTodos(this.filtro).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((response) => {
      this.passes = response.data;


      this.totalBase = response.meta.current_page ?
        response.meta.current_page === 1 ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);
    });
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

  buscarPatentes(): void {
    const opcoes = {}
    let todos = true

    const PClass: any = [];
    const AuxPClass = new Set();

    this.patenteClasses.push({
      id: 'null',
      text: 'Todos'
    })

    this.patenteService.listar(opcoes)
      .pipe(
        finalize((): void => {

          const patenteClasses = PClass.filter((pc: any) => {
            const duplicadoPatente = AuxPClass.has(pc.id);
            AuxPClass.add(pc.id);
            return !duplicadoPatente;
          });

          this.patenteClasses.push(...patenteClasses)

        })
      )
      .subscribe((response: any): void => {

        response.map((item: any) => {
          if (todos) {
            todos = false
            this.patentes.push({
              id: 'null',
              text: 'Todos'
            })
          }

          this.patentes.push({ id: item.id, text: item.nome })
          PClass.push({ id: item.classe, text: item.classe })

        })

      })
  }

  buscarTipoVinculo(): void {
    const opcoes = {}
    let todos = true
    this.tipoVinculoService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        response.map((item: any) => {

          if (todos) {
            todos = false
            this.tipoVinculos.push({
              id: 'null',
              text: 'Todos'
            })
          }

          this.tipoVinculos.push({ id: item.id, text: item.nome })
        })

      })
  }

  selecionarOrgaoOuComandoProvincial($event: any): void {

    const opcoes = {
      tipo_orgao: $event
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

        const org = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
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
      this.filtro.regimeId = $e.target.value;
    } else if (key == 'patenteId') {
      this.filtro.patenteId = $e.target.value;
    } else if (key == 'tipoVinculoId') {
      this.filtro.tipoVinculoId = $e.target.value;
    } else if (key == 'tipoOrgaoId') {
      this.filtro.tipoOrgaoId = $e;
      this.filtro.orgaoId = 'null';
    } else if (key == 'orgaoId') {
      this.filtro.orgaoId = $e;
    } else if (key == 'genero') {
      this.filtro.genero = $e;
    } else if (key == 'patenteClasse') {
      this.filtro.patenteClasse = $e.target.value;
    }

    this.buscarPasses()
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
    this.filtro.search = ''
    this.buscarPasses()

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

  public formatarGuia(guia: any) {
    return guia.toString().trim()
  }

  public setItem(item: any, imprimir: boolean) {
    this.agente = item
    this.imprimir = imprimir
  }

  public setNullValue() {
    this.agente = null;
    this.imprimir = false;
  }

}
