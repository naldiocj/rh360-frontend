import { Component, OnInit } from '@angular/core';

import { RegimeService } from '@core/services/Regime.service';
import { PatenteService } from '@core/services/Patente.service';
import { FuncionarioService } from '@core/services/Funcionario.service';

import { Pagination } from '@shared/models/pagination';
import { Funcionario } from '@shared/models/Funcionario.model';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';

import { TipoVinculoService } from '@resources/modules/sigpq/core/service/Tipo-vinculo.service';

import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import { SecureService } from '@core/authentication/secure.service';
import { ActivatedRoute } from '@angular/router';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { EstadosParaFuncionario } from '@resources/modules/sigpq/core/service/config/Estados-para-Funcionario.service';
import { SituacaoEstadoService } from '@resources/modules/sigpq/core/service/config/Situacao-Estado.service';
import { TipoCarreiraOuCategoriaService } from '@resources/modules/sigpq/core/service/config/Tipo-carreira-ou-categoria.service';
import { UtilsHelper } from '@core/helper/utilsHelper';

@Component({
  selector: 'app-sigpq-mobilidade-listar-agentes',
  templateUrl: './listar-agentes.component.html',
  styleUrls: ['./listar-agentes.component.css'],
})
export class ListarAgentesComponent implements OnInit {
  public funcionarios: Funcionario[] = [];

  public tipoVinculos: Array<Select2OptionData> = []
  public regimes: Array<Select2OptionData> = []
  public patenteClasses: Array<any> = []
  public patentes: Array<Select2OptionData> = []
  public tipoOrgaos: Array<Select2OptionData> = []
  public orgaos: Array<Select2OptionData> = []
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
  public idadeMenos = 18

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
    search: "",
    idadeMais: 'null',
    idadeMenos: 'null',
    anoMais: 'null',
    anoMenos: 'null',
    dashboard: false
  }

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
    private estruturaOrganicaServico: TipoEstruturaOrganica,
    private estadosParaFuncionarioService: EstadosParaFuncionario,
    private situacaoEstadoService: SituacaoEstadoService,
    private tipoCarreiraOuCategoriaService: TipoCarreiraOuCategoriaService,
    public utilsHelper:UtilsHelper
  ) {
    this.orgaos.push({
      id: 'null',
      text: 'Todos',
    });
  }

  ngOnInit() {
    this.buscarRegimes();
    this.buscarSituacaoEstados()
    this.buscarTipoEstruturaOrganica()
    this.validarBuscaDeAgentes();
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

  validarBuscaDeAgentes() {
    const id = this.activatedRoute.snapshot.queryParamMap.get('id');
    const valor = this.activatedRoute.snapshot.queryParamMap.get('valor');

    if (id && valor && !this.filtro.dashboard) {
      this.filtrarPaginaRedirecionamento(id, valor);
    } else {
      this.buscarFuncionario();
    }
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
        this.contarFuncionariosPorPagina();
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
    let todos = true;
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
    if (!$event || $event == 'null')
      {
        this.patentes = [];
          this.patentes.push({
            id: 'null',
            text: 'Todos',
          });
          return;
      }

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

        let aux: any = response
        .filter((item: any) => item.nome.toUpperCase() !== "Tesoureiro".toUpperCase())
        .map((item: any) => ({ id: item.id, text: item.nome }))
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
    else if (key == 'idadeMenos') {
      this.filtro.idadeMenos = $e.target.value

    }
    else if (key == 'idadeMais') {
      this.filtro.idadeMais = $e.target.value

    }
    else if (key == 'anoMais') {
      this.filtro.anoMais = $e.target.value
    }
    else if (key == 'anoMenos') {
      this.filtro.anoMenos = $e.target.value
    }

    if (reiniciar) {
      this.filtro.page = 1
    }


    this.filtro.dashboard = false;
    this.buscarFuncionario();
  }

  filtrarPaginaRedirecionamento(id: string, valor: string) {
    if (id && valor) {
      if (id == 'regimeId') {
        this.filtro.regimeId = valor;
      } else if (id == 'patenteId') {
        this.filtro.patenteId = valor;
      } else if (id == 'tipoVinculoId') {
        this.filtro.tipoVinculoId = valor;
      } else if (id == 'genero') {
        this.filtro.genero = valor;
      } else if (id == 'patenteClasse') {
        this.filtro.patenteClasse = valor;
      }
    }

    this.filtro.dashboard = true;
    this.buscarFuncionario();
  }

  recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarFuncionario();
  }

  /* selecionarAgenteParaMobilidade(item: any) {
     const auxitem={page:this.filtro.page,...item}
     console.log("Efectivo:",auxitem)
    const conjuntoUnico = new Set(this.agentesSelecionados);
    const index = conjuntoUnico.has(item);
    if (!index) {
      conjuntoUnico.add(item);
    } else {
      conjuntoUnico.delete(item);
    }
    this.agentesSelecionados = Array.from(conjuntoUnico);
  } */

  estaTudoPreenchido: boolean = false;
  async contarFuncionariosPorPagina() {
    this.estaTudoPreenchido = this.agentesSelecionados.filter(
      (funcionario:any) => funcionario.page == this.filtro.page
    ).length == this.funcionarios.length;
  }

  toggleExportarFuncionario(event: any, funcionario: any,ordem:number) {
    const camposSelecionados = {
      ...funcionario,
      page: this.filtro.page,
      ordem:ordem
    };
    if (event.target.checked) {
      // Adicionar ao array se o checkbox for marcado
      this.agentesSelecionados.push(camposSelecionados);
    } else {
      // Remover do array se o checkbox for desmarcado
      this.agentesSelecionados = this.agentesSelecionados.filter(
        (f:any) => f.id !== funcionario.id
      );
    }
    this.ordenarFuncionariosPorId()
  }

  selecionarTodosEfectivos(event: any) {
    this.funcionarios.forEach((element: any, index) => {

      if (event.target.checked) {
        // Adicionar ao array se o checkbox for marcado
        const camposSelecionados = {
          ...element,
          page: this.filtro.page,
          ordem:this.totalBase+index+1
        }; 

        // Verifica se o funcionário já existe na lista antes de adicionar
        const jaExiste = this.agentesSelecionados.some(
          (item:any) => item.id == camposSelecionados.id
        );

        if (!jaExiste) {
          this.agentesSelecionados.push(camposSelecionados);
        }

      } else {
        this.agentesSelecionados = this.agentesSelecionados.filter(
          (funcionario:any) => funcionario.page !== this.filtro.page
        );
      }

      this.ordenarFuncionariosPorId()
    });

  }

  async ordenarFuncionariosPorId() {
    await this.contarFuncionariosPorPagina()
    return this.agentesSelecionados.sort((element_a:any, element_b:any) => element_a.ordem - element_b.ordem);
  }

  isSelecionado(item: any): boolean {
    return this.agentesSelecionados.some((func:any) => func.id == item.id);
  }
  /* validarSelecionado(id: number | undefined) {
    const numeroUmExiste = this.agentesSelecionados.find(
      (o: any) => o.id == id
    );
    if (numeroUmExiste) return true;
    return false;
  } */

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
}
