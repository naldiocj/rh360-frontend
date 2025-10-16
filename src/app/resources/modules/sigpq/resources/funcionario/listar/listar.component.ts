import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { RegimeService } from '@core/services/Regime.service';
import { PatenteService } from '@core/services/Patente.service';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { Pagination } from '@shared/models/pagination';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { TipoVinculoService } from '@resources/modules/sigpq/core/service/Tipo-vinculo.service';
import { Select2OptionData } from 'ng-select2';
import { delay, finalize, first, of } from 'rxjs';
import { SecureService } from '@core/authentication/secure.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { EstadosParaFuncionario } from '@resources/modules/sigpq/core/service/config/Estados-para-Funcionario.service';
import { SituacaoEstadoService } from '@resources/modules/sigpq/core/service/config/Situacao-Estado.service';
import { AuthService } from '@core/authentication/auth.service';
import { TipoCarreiraOuCategoriaService } from '@resources/modules/sigpq/core/service/config/Tipo-carreira-ou-categoria.service';
import { UtilsHelper } from '@core/helper/utilsHelper';
import { TipoCargoService } from '@resources/modules/sigpq/core/service/Tipo-cargo.service';
import { RelatorioLicencaService } from '../../../core/service/Relatorio-licenca.service';
@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent implements OnInit, OnDestroy, AfterViewInit {
  public funcionarios: any[] = [];
  public pessoaId: number | null = null;

  public tipoVinculos: Array<Select2OptionData> = [];
  public regimes: Array<Select2OptionData> = [];
  public patenteClasses: Array<Select2OptionData> = [];
  public patentes: Array<Select2OptionData> = [];
  public tipoOrgaos: Array<Select2OptionData> = [];
  public orgaos: Array<Select2OptionData> = [];
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public tipoOrdenacao: Array<Select2OptionData> = [];
  public situacaoEstados: Array<Select2OptionData> = [];
  public estado: Array<Select2OptionData> = [];
  public tipoCargos: Array<Select2OptionData> = [];
  public tituloSituacao: string = '';
  public mostrarCarreira = false;

  public generos: Array<Select2OptionData> = [
    { id: 'null', text: 'Todos' },
    { id: 'M', text: 'Masculino' },
    { id: 'F', text: 'Feminino' },
  ];

  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: 'null', text: 'Todos' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
    { id: 'Orgão', text: 'Orgão Central' },
  ];

  agenteSelecionado: any;

  public _regimeSelecionado: string = 'null';
  public _classeSelecionada: string = 'null';
  public isLoading: boolean = false;
  public pagination = new Pagination();
  id: any;
  valor: any;

  totalBase: number = 0;

  filtro = {
    page: 1,
    perPage: 5,
    regimeId: 'null',
    patenteId: 'null',
    patenteClasse: 'null',
    tipoVinculoId: 'null',
    tipoOrgaoId: 'null',
    situacaoId: '1',
    //forcaPassiva: 'null',
    estadoId: 'null',
    orgaoId: 'null',
    genero: 'null',
    funcao_id: 'null',
    search: '',
    idadeMais: 'null',
    idadeMenos: 'null',
    anoMais: 'null',
    anoMenos: 'null',
    orderby: 'null',
    dashboard: false,
  };

  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  options_ordenar: any = {
    placeholder: 'Selecione uma opção',
    width: '140%',
  };

  public idadeMenos = 18;

  arquivoBase64 = null;

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
    public authService: AuthService,
    public utilsHelper: UtilsHelper,
    private tipoCargoService: TipoCargoService,
    private relatorioService: RelatorioLicencaService
  ) {
    this.orgaos.push({
      id: 'null',
      text: 'Todos',
    });
    this.patentes.push({
      id: 'null',
      text: 'Todos',
    });
  }


  funcionariosSelecionados: any[] = [];

  ngOnDestroy(): void {
    const id = this.activatedRoute.snapshot.queryParamMap.get('id');
    if (!id)
      sessionStorage.setItem(
        'buscarUsuarioListagem',
        JSON.stringify(this.filtro)
      );
  }

  fillTipoOrdenacao() {
    this.tipoOrdenacao.push({
      id: 'null',
      text: 'Padrão',
    });
    this.tipoOrdenacao.push({ id: 'PATENTE', text: 'Patente' });
    this.tipoOrdenacao.push({ id: 'NIP', text: 'Nip' });
    this.tipoOrdenacao.push({ id: 'NOME', text: 'Nome' });
  }

  ngOnInit() {
    this.fillTipoOrdenacao();
  }

  ngAfterViewInit() {
    this.buscarRegimes();
    //this.buscarClasses()
    this.validarBuscaDeAgentes();
    this.buscarTipoEstruturaOrganica();
    this.buscarSituacaoEstados();
    this.buscarTipoCargo();
  }

  buscarTipoCargo(): void {
    const opcoes = {};
    this.tipoCargoService
      .listar(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.tipoCargos = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }

  private buscarSituacaoEstados() {
    this.situacaoEstadoService
      .listarTodos({})
      .pipe()
      .subscribe({
        next: (response: any) => {
          const aux = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
          console.log(aux);
          this.situacaoEstados = [];
          this.situacaoEstados.push({
            id: 'null',
            text: 'Todos',
          });
          this.situacaoEstados.push(...aux);
        },
      });
  }

  toggleAgenteSelecionado(agente: any) {
    this.agenteSelecionado = agente;
  }

  validarBuscaDeAgentes() {
    this.id = this.activatedRoute.snapshot.queryParamMap.get('id');
    this.valor = this.activatedRoute.snapshot.queryParamMap.get('valor');

    const buscaUsuario = sessionStorage.getItem('buscarUsuarioListagem');
    const filtragem: any = buscaUsuario ? JSON.parse(buscaUsuario) : {};
    const _filtros = filtragem ?? this.filtro;
    this.filtro = _filtros;

    if (this.id && this.valor && !this.filtro.dashboard) {
      this.filtrarPaginaRedirecionamento(this.id, this.valor);
    } else {
      this.buscarFuncionario();
    }
  }

  public get buscarValor() {
    return this.activatedRoute.snapshot.queryParamMap.get('valor');
  }

  public get buscarId() {
    return this.activatedRoute.snapshot.queryParamMap.get('id');
  }

  validarAlgunsFiltros() {
    this.filtro.situacaoId = '1';
    if (!this.filtro.funcao_id) this.filtro.funcao_id = 'null';
    if (!this.filtro.regimeId && !this.id && !this.valor) {
      this.filtro.patenteClasse = 'null';
      this.filtro.patenteId = 'null';
    }
  }

  buscarFuncionario() {
    if (this.isLoading) return;
    this.validarAlgunsFiltros();
    this.isLoading = true;
    this.filtro.page = this.filtro.page || 1;
    this.filtro.perPage = this.filtro.perPage || 5;
    of(null)
      .pipe(
        // delay(3000),
        finalize(() => {
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
                  : (response.meta.current_page - 1) * response.meta.per_page +
                    1
                : this.totalBase;

              this.pagination = this.pagination.deserialize(response.meta);
            });
        })
      )
      .subscribe(); // Não se esqueça de se inscrever no Observable
  }

  buscarRegimes(): void {
    const opcoes = {};

    this.regimeService
      .listar(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.regimes = [];
        this.regimes.push({
          id: 'null',
          text: 'Todos',
        });
        const aux = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
        this.regimes.push(...aux);
      });
  }

  // private buscarClasses(event: any): void {

  //   if (!event || event == 'null') return

  //   const opcoes = {
  //     regime_id: event
  //   }

  //   const PClass: any = [];
  //   const AuxPClass = new Set();

  //   this.patenteService.listar(opcoes)
  //     .pipe(
  //       finalize((): void => {
  //         const patenteClasses = PClass.filter((pc: any) => {
  //           const duplicadoPatente = AuxPClass.has(pc.id);
  //           AuxPClass.add(pc.id);
  //           return !duplicadoPatente;
  //         });
  //         let aux: any = patenteClasses.map((item: any) => ({ id: item.id, text: item.text }))

  //         this.patenteClasses = []
  //         this.patenteClasses.push({
  //           id: 'null',
  //           text: 'Todos'
  //         })
  //         this.patenteClasses.push(...aux)

  //       })
  //     ).subscribe({
  //       next: (response: any) => {
  //         response.map((item: any) => {
  //           PClass.push({ id: item.classe, text: item.classe })
  //         })
  //       }
  //     })

  // }

  private buscarTipoCarreiraOuCategoria(event: any): void {
    if (!event) return;

    const opcoes = {
      regime_id: event,
    };
    this.tipoCarreiraOuCategoriaService
      .listar(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.patenteClasses = [];
        this.patenteClasses.push({
          id: 'null',
          text: 'Todos',
        });

        let aux: any = response
          .filter(
            (item: any) =>
              item.nome.toUpperCase() !== 'Tesoureiro'.toUpperCase()
          )
          .map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        this.patenteClasses.push(...aux);
        // this.tipoCarreiraOuCategorias = response.map((item: any) => ({ id: item.id, text: item.nome }))
        // this.tipoCarreiraOuCategorias_ = response;
      });
  }

  private buscarPatentes($event: any) {
    if (!$event || $event == 'null') {
      this.patentes = [];
      this.patentes.push({
        id: 'null',
        text: 'Todos',
      });
      return;
    }

    const options = {
      sigpq_tipo_carreira_id: $event,
    };

    this.patenteService
      .listar(options)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        const aux = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
        this.patentes = [];
        this.patentes.push({
          id: 'null',
          text: 'Todos',
        });

        this.patentes.push(...aux);
        // this.patentes = response.map((item: any) => ({ id: item.id, text: item.nome }))
      });
    // if (!$event || $event == 'null') return

    // const options = {
    //   classe: $event
    // }
    // this.patenteService.listar(options).pipe().subscribe((response: any): void => {

    //   const aux = response.map((item: any) => ({ id: item.id, text: item.nome }))
    //   this.patentes = []
    //   this.patentes.push({
    //     id: 'null',
    //     text: 'Todos'
    //   })

    //   this.patentes.push(...aux)

    // })
  }

  private buscarTipoEstruturaOrganica() {
    this.estruturaOrganicaServico
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.tipoEstruturaOrganicas = [];
        this.tipoEstruturaOrganicas.push({
          id: 'null',
          text: 'Todos',
        });

        const org = response.map((item: any) => ({
          id: item.sigla,
          text: item.name,
        }));

        // response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
        this.tipoEstruturaOrganicas.push(...org);
      });
  }

  buscarTipoVinculo($event: any): void {
    this.mostrarCarreira = false;
    this.tipoVinculos = [];
    if (!$event || $event == 'null') return;

    if ($event == 1) {
      this.mostrarCarreira = true;
    } else {
      this.mostrarCarreira = false;
    }

    const [regime] = this.regimes.filter((item: any) => item.id == $event);

    const opcoes = {
      regime: regime?.text,
    };
    let todos = true;
    this.tipoVinculoService
      .listar(opcoes)
      .pipe(
        finalize((): void => {
          if ($event == 1) {
            this.tipoVinculos = this.tipoVinculos.filter(
              (item: any) => item?.id == 1
            );
          }
        })
      )
      .subscribe((response: any): void => {
        this.tipoVinculos = [];
        this.tipoVinculos.push({
          id: 'null',
          text: 'Todos',
        });
        const aux = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));

        this.tipoVinculos.push(...aux);
      });

    this.buscarTipoCarreiraOuCategoria($event);
  }

  selecionarOrgaoOuComandoProvincial($event: any): void {
    if (!$event) return;

    const opcoes = {
      tipo_estrutura_sigla: $event,
    };
    this.direcaoOuOrgaoService
      .listarTodos(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.orgaos = [];
        this.orgaos.push({
          id: 'null',
          text: 'Todos',
        });

        const org = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome_completo,
        }));
        this.orgaos.push(...org);
      });

    this.filtrarPagina('tipoOrgaoId', $event);
  }

  filtrarPagina(key: any, $e: any, reiniciar: boolean = true) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    } else if (key == 'regimeId') {
      this._regimeSelecionado =
        key == 'null' ? key : this.getNameFilterById($e, this.regimes);
      this.filtro.regimeId = $e;
      this.atualizarDescricaoNoTopoDaListagem();
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
      this._classeSelecionada =
        key == 'null' ? key : this.getNameFilterById($e, this.patenteClasses);
      this.filtro.patenteClasse = $e;
      this.atualizarDescricaoNoTopoDaListagem();
      this.buscarPatentes($e);
    } else if (key == 'situacaoId') {
      this.filtro.situacaoId = $e;
      this.selecionarSituacaoLaboral($e);
    } else if (key == 'estadoId') {
      this.filtro.estadoId = $e;
    } else if (key == 'idadeMenos') {
      this.filtro.idadeMenos = $e.target.value;
    } else if (key == 'idadeMais') {
      this.filtro.idadeMais = $e.target.value;
    } else if (key == 'anoMais') {
      this.filtro.anoMais = $e.target.value;
    } else if (key == 'anoMenos') {
      this.filtro.anoMenos = $e.target.value;
    } else if (key == 'orderby') {
      this.filtro.orderby = $e;
    } else if (key == 'funcao') {
      this.filtro.funcao_id = $e;
    }
    if (reiniciar) {
      this.filtro.page = 1;
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
      } else if (id == 'forcaActiva') {
        this.filtro.situacaoId = valor;
        this.selecionarSituacaoLaboral(valor);
      } /* else if (id == 'forcaPassiva') {
        this.filtro.forcaPassiva = valor;
      } */
    }
    this.filtro.dashboard = true;
    this.buscarFuncionario();
  }

  validarEliminar(item: any) {
    Swal.fire({
      title: 'Eliminar?',
      html: `Pretende eliminar <b>${item.nome_completo} </b>? Esta ação não poderá ser revertida!`,
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      // timer: 2000,
      showCancelButton: true,
      confirmButtonText: 'Sim, Eliminar!',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary px-2 mr-1',
        cancelButton: 'btn btn-danger ms-2 px-2',
      },
    }).then((result: any) => {
      if (result.value) {
        this.eliminar(item.id);
      }
    });
  }

  eliminar(id: number) {
    this.isLoading = true;
    this.funcionarioServico
      .eliminar(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.filtrarPagina('page', 1);
      });
  }

  recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.filtro.regimeId = 'null';
    this.filtro.patenteId = 'null';
    this.filtro.patenteClasse = 'null';
    this.filtro.tipoVinculoId = 'null';
    this.filtro.tipoOrgaoId = 'null';
    this.filtro.situacaoId = 'null';
    this.filtro.estadoId = 'null';
    this.filtro.orgaoId = 'null';
    this.filtro.genero = 'null';
    this.filtro.idadeMenos = 'null';
    this.filtro.idadeMais = 'null';
    this.filtro.anoMais = 'null';
    this.filtro.anoMenos = 'null';
    this.filtro.situacaoId = 'null';
    this.filtro.orderby = 'null';
    this.filtro.funcao_id = 'null';
    this.filtro.dashboard = false;
    this.buscarFuncionario();
  }

  construcao() {
    alert('Em construção');
  }

  get getAuth() {
    return this.sec.getTokenValueDecode();
  }

  public selecionarSituacaoLaboral($event: any) {
    this.tituloSituacao = '';

    if (!$event || $event == 'null') return;
    const [situacao] = this.situacaoEstados.filter(
      (item: any) => item.id == $event
    );
    if (!situacao) return;

    this.tituloSituacao = situacao.text;

    const options = {
      sigpq_situacao_estado_id: $event,
    };

    this.estadosParaFuncionarioService
      .listarTodos(options)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.estado = [];
          this.estado.push({
            id: 'null',
            text: 'Todos',
          });
          const aux = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));

          this.estado.push(...aux);
        },
      });
  }

  public get isAdmin() {
    return ['admin', 'root'].includes(this.role);
  }

  private get role() {
    return this.authService?.role?.name?.toString().toLowerCase();
  }

  mostrarId(dados: string | number) {
    console.log('Id do usuario:', dados);
  }

  getNameFilterById(id: string, array: any) {
    const foundItem = array.find(
      (item: { id: string; text: string }) => item.id == id
    );
    return foundItem ? foundItem.text : null; // Retorna o nome ou null se não encontrado
  }

  atualizarDescricaoNoTopoDaListagem() {
    const dizerNaTela = (() => {
      if (
        this._classeSelecionada === 'null' &&
        this._regimeSelecionado === 'null'
      ) {
        return 'Listagem dos Agentes';
      } else if (
        this._classeSelecionada === 'null' &&
        this._regimeSelecionado !== 'null'
      ) {
        return 'Listagem dos ' + (this._regimeSelecionado ?? 'Agentes');
      } else {
        return 'Listagem dos ' + (this._classeSelecionada ?? ' Agentes');
      }
    })();

    return 'Listagem dos Agentes';
  }

  public setPessoaId(pessoaId: number | null) {
    this.pessoaId = pessoaId;
  }

  public isEfectividade(text: string): boolean {
    if (!text) return false;
    return ['efectividade'].includes(text.toString().toLocaleLowerCase());
  }

  fileUrl: any = null;
  carregando_exportacao: boolean = false;

  exportarListaDeAgentesSelecionados() {
    this.carregando_exportacao = true;
    /*  this.gerarDocumentoParaLicencaDoTipo=type
     this.showModal('modalVisualizarFichaDoEfectivoComBaseALicenca')
     this.licenca_disciplinarComponent.atualizarTodosOsDados() */
    this.showModal('modalVisualizarEfectivos');
    const options = {
      agentes: JSON.stringify(this.funcionariosSelecionados),
    };
    this.relatorioService
      .gerarModeloExportacaoAgentes(options)
      .pipe(
        first(),
        finalize(() => {
          this.carregando_exportacao = false;
        })
      )
      .subscribe((response: any) => {
        console.log('RESULTADO DA GERAÇÃO:', response);
        this.fileUrl = this.relatorioService.createImageBlob(response);
      });
  }

  selecionarTodosEfectivos(event: any) {
    this.funcionarios.forEach((element: any) => {
      if (event.target.checked) {
        // Adicionar ao array se o checkbox for marcado
        const camposSelecionados = {
          id: element.id,
          nome_completo_apelido:
            element.nome_completo + (element.apelido ?? ''),
          nip: element.nip,
          patente_nome: element.patente_nome,
          sexo: element.genero,
          page: this.filtro.page,
          numero_agente: element.numero_agente, // Corrigido para usar o número do agente
        };

        // Verifica se o funcionário já existe na lista antes de adicionar
        const jaExiste = this.funcionariosSelecionados.some(
          (item) => item.id == camposSelecionados.id
        );

        if (!jaExiste) {
          this.funcionariosSelecionados.push(camposSelecionados);
        }
      } else {
        this.funcionariosSelecionados = this.funcionariosSelecionados.filter(
          (funcionario) => funcionario.page !== this.filtro.page
        );
      }

      this.ordenarFuncionariosPorId();
    });
  }

  isSelecionado(item: any): boolean {
    return this.funcionariosSelecionados.some((func) => func.id == item.id);
  }

  toggleExportarFuncionario(event: any, funcionario: any) {
    const camposSelecionados = {
      id: funcionario.id,
      nome_completo_apelido:
        funcionario.nome_completo + (funcionario.apelido ?? ''),
      nip: funcionario.nip,
      patente_nome: funcionario.patente_nome,
      sexo: funcionario.genero,
      page: this.filtro.page,
      numero_agente: funcionario.genero,
    };

    if (event.target.checked) {
      // Adicionar ao array se o checkbox for marcado
      this.funcionariosSelecionados.push(camposSelecionados);
    } else {
      // Remover do array se o checkbox for desmarcado
      this.funcionariosSelecionados = this.funcionariosSelecionados.filter(
        (f) => f.id !== funcionario.id
      );
    }
    this.ordenarFuncionariosPorId();
  }

  async ordenarFuncionariosPorId() {
    await this.contarFuncionariosPorPagina();
    return this.funcionariosSelecionados.sort(
      (element_a, element_b) => element_b.id - element_a.id
    );
  }

  estaTudoPreenchido: boolean = false;

  async contarFuncionariosPorPagina() {
    this.estaTudoPreenchido =
      this.funcionariosSelecionados.filter(
        (funcionario) => funcionario.page == this.filtro.page
      ).length == this.funcionarios.length;
  }

  showModal(modalName: string) {
    const modal = document.getElementById(modalName);
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeModal(modalName: string) {
    const modal = document.getElementById(modalName);
    if (modal) {
      modal.style.display = 'none'; // Fecha o modal
    }
  }

  fecharModalRelatorio() {
    this.fileUrl = null;
    this.relatorioService.cancelarGeracaoRelatorio();
  }
}
