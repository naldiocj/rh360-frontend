import { Component, OnInit } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { PatenteService } from '@core/services/Patente.service';
import { PessoaFisicaService } from '@core/services/PessoaFisica.service';
import { RegimeService } from '@core/services/Regime.service';
import { CoresEstadoHelper } from '@resources/modules/sigpq/core/helper/CoresEstados.helper';
import { SigpjApiService } from '@resources/modules/sigpq/core/service/api/sigpj.service';
import { RelatorioService } from '@resources/modules/sigpq/core/service/Relatorio.service';
import { TipoVinculoService } from '@resources/modules/sigpq/core/service/Tipo-vinculo.service';
import { Pagination } from '@shared/models/pagination';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { finalize, first } from 'rxjs';

@Component({
  selector: 'app-sigpq-sistuacao-disciplinar-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  public tipoVinculos: Array<Select2OptionData> = []
  public regimes: Array<Select2OptionData> = []
  public patenteClasses: Array<any> = []
  public patentes: Array<Select2OptionData> = []
  public tipoOrgaos: Array<Select2OptionData> = []
  public orgaos: Array<Select2OptionData> = []
  public pessoaEstados: Array<Select2OptionData> = []

  public generos: Array<Select2OptionData> = [
    { id: 'null', text: 'Todos' },
    { id: 'M', text: 'Masculino' },
    { id: 'F', text: 'Feminino' }
  ]

  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: 'null', text: "Todos" },
    { id: 'Comando Provincial', text: "Comando Provincial" },
    { id: 'Orgão', text: "Orgão Central" },
  ]

  estados = ['P', 'E', 'A', 'C', 'R', '']

  carregandoOpcoesDoSelector: boolean = false
  carregando: boolean = false
  submited: boolean = false
  fileUrl: any = null

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%',
  }

  optionsMultiplo: any = {
    placeholder: "Selecione uma opção",
    width: '100%',
    multiple: true
  }


  opcoesDoSelector: any = []
  relatorioArr: any = []

  valoresSelecionados: string[] = [];

  public filtro = {
    page: 1,
    perPage: 10,
    search: '',
    regime: null,
    estado: null
  }

  public agentes: any = []
  public totalBase: number = 0
  public isLoading: boolean = false
  public pagination = new Pagination();

  constructor(
    private sec: SecureService,
    private sigpjApiService: SigpjApiService,
    private regimeService: RegimeService,
    private patenteService: PatenteService,
    private relatorioService: RelatorioService,
    private tipoVinculoService: TipoVinculoService,
    private pessoaFisicaService: PessoaFisicaService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService) {
    this.orgaos.push({
      id: 'null',
      text: 'Todos'
    })
  }

  ngOnInit(): void {
    this.buscarSituacaoDisciplinarAgentes()
  }

  buscarSituacaoDisciplinarAgentes(): void {
    let todos = true
    this.sigpjApiService.listarSituacaoDisciplinarAgentes(this.filtro)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.agentes = response.data;
        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      })
  }

  buscarCor(estado: string) {
    return CoresEstadoHelper.buscarCor(estado) || '#000000';
  }

  buscarTexto(letra: string) {
    return CoresEstadoHelper.buscarTexto(letra) || 'Pendente';
  }

  filtrarPagina(key: any, $e: any, reiniciar: boolean = true) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
      this.filtro.page = 1
    } else if (key == 'regime') {
      this.filtro.regime = $e.target.value;
      // } else if (key == 'vinculo') {
      //   this.filtro.vinculo = $e.target.value;
    } else if (key == 'estado') {
      this.filtro.estado = $e.target.value;
    }
    this.buscarSituacaoDisciplinarAgentes()
  }

  recarregarPagina() {
    this.filtro.page = 1
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.buscarSituacaoDisciplinarAgentes()
  }







  buscarOpcoesDoSelector() {
    this.carregandoOpcoesDoSelector = true
    this.relatorioService.buscarOpcoesDoSelector()
      .pipe(
        first(),
        finalize(() => {
          this.carregandoOpcoesDoSelector = false;
        })
      ).subscribe((response) => {
        this.opcoesDoSelector = response
      });
  }

  buscarPessoaEstado() {
    this.carregandoOpcoesDoSelector = true
    this.pessoaFisicaService.listarEstados({})
      .pipe(
        first(),
        finalize(() => {
          this.carregandoOpcoesDoSelector = false;
        })
      ).subscribe((response) => {
        this.pessoaEstados = []
        this.pessoaEstados.push({
          id: 'null',
          text: 'Todos'
        })

        const data = response.map((obj: any) => ({
          id: obj.estado,
          text: obj.estado
        }))

        this.pessoaEstados.push(...data)

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
        response.map((item: any) => {
          if (todos) {
            todos = false
            this.regimes.push({
              id: 'null',
              text: 'Todos'
            })
          }

          this.regimes.push({ id: item.id, text: item.nome })
        })

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

  }

  validarSelecionados(): boolean {
    return this.valoresSelecionados.length < 2
  }

  onSubmit() {

    if (this.carregando) {
      return
    }

    this.carregando = true
    // this.submited = true

    const options = {
      ...this.filtro,
      valoresSelecionados: this.valoresSelecionados
    }

    this.relatorioService.gerar(options)
      .pipe(
        first(),
        finalize(() => {
          this.carregando = false;
        })
      ).subscribe((response) => {

        this.fileUrl = this.relatorioService.createImageBlob(response);

      });

  }

  fecharModalRelatorio() {
    this.submited = false
    this.carregando = false
    this.fileUrl = null
    this.relatorioService.cancelarGeracaoRelatorio()
  }

  get getAuth() {
    return this.sec.getTokenValueDecode()
  }
}
