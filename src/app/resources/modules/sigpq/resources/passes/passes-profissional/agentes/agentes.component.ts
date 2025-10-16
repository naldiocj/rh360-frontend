import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SecureService } from '@core/authentication/secure.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { PatenteService } from '@core/services/Patente.service';
import { RegimeService } from '@core/services/Regime.service';
import { TipoCarreiraOuCategoriaService } from '@resources/modules/sigpq/core/service/config/Tipo-carreira-ou-categoria.service';
import { TipoVinculoService } from '@resources/modules/sigpq/core/service/Tipo-vinculo.service';
import { Funcionario } from '@shared/models/Funcionario.model';
import { Pagination } from '@shared/models/pagination';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-agentes',
  templateUrl: './agentes.component.html',
  styleUrls: ['./agentes.component.css']
})
export class AgentesComponent implements OnInit {

  public funcionarios: Funcionario[] = [];

  public tipoVinculos: Array<Select2OptionData> = [];
  public regimes: Array<Select2OptionData> = [];
  public patenteClasses: Array<any> = [];
  public patentes: Array<Select2OptionData> = [];
  public orgaos: Array<Select2OptionData> = [];
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public situacaoEstados: Array<Select2OptionData> = [];
  public estado: Array<Select2OptionData> = []
  public tituloSituacao: string = ''
  public mostrarCarreira = false;

  public generos: Array<Select2OptionData> = [
    { id: 'null', text: 'Todos' },
    { id: 'M', text: 'Masculino' },
    { id: 'F', text: 'Feminino' },
  ];

  public isLoading: boolean = false;
  public pagination = new Pagination();

  totalBase: number = 0;

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
    search: '',
  };

  agentesSelecionados: any = [];

  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  listarPDF: any = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private sec: SecureService,
    private funcionarioServico: FuncionarioService,
    private tipoVinculoService: TipoVinculoService,
    private patenteService: PatenteService,
    private regimeService: RegimeService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private tipoCarreiraOuCategoriaService: TipoCarreiraOuCategoriaService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,

  ) {
    this.orgaos.push({
      id: 'null',
      text: 'Todos',
    });
  }

  ngOnInit() {
    this.buscarRegimes();
    this.buscarFuncionario();
    this.buscarTipoEstruturaOrganica()
  }


  buscarFuncionario() {
    this.isLoading = true;
    this.funcionarioServico
      .listar(this.filtro)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.funcionarios = response.data;


        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  buscarRegimes(): void {
    const opcoes = {};
    this.regimeService
      .listar(opcoes)
      .pipe(finalize((): void => { }))
      .subscribe((response: any): void => {
        this.regimes = []
        this.regimes.push({
          id: 'null',
          text: 'Todos'
        })

        const aux = response.map((item: any) => ({ id: item.id, text: item.nome }));
        this.regimes.push(...aux)
      });
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
    } else if (key == 'patenteClass') {
      this.filtro.patenteClasse = $e.target.value;
    }

    if (reiniciar) {
      this.filtro.page = 1;
    }

    this.buscarFuncionario();
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
    this.buscarFuncionario();
  }

  selecionarAgenteParaMobilidade(item: any) {
    const conjuntoUnico = new Set(this.agentesSelecionados);
    const index = conjuntoUnico.has(item);
    if (!index) {
      conjuntoUnico.add(item);
    } else {
      conjuntoUnico.delete(item);
    }
    this.agentesSelecionados = Array.from(conjuntoUnico);
  }

  validarSelecionado(id: number | undefined) {
    const numeroUmExiste = this.agentesSelecionados.find(
      (o: any) => o.id == id
    );
    if (numeroUmExiste) return true;
    return false;
  }

  limparVariaveis() {
    this.agentesSelecionados = [];
  }

  construcao() {
    alert('Em construção');
  }

  get getAuth() {
    return this.sec.getTokenValueDecode();
  }

  visualizar(item: any) {
    this.listarPDF = [];
    this.listarPDF.push(item);
    // this.listarPDF.push(item)
  }

  public get getTemAgentesSelecionados(): boolean {
    return this.agentesSelecionados.length > 0;
  }
  public get getMaisAgentesSelecionados(): boolean {
    return this.getTemAgentesSelecionados && this.agentesSelecionados.length > 1;
  }
}
