import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { RegimeService } from '@core/services/Regime.service';
import { PatenteService } from '@core/services/Patente.service';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { Pagination } from '@shared/models/pagination';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';

import { TipoVinculoService } from '@resources/modules/sigpq/core/service/Tipo-vinculo.service';

import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import { SecureService } from '@core/authentication/secure.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { EstadosParaFuncionario } from '@resources/modules/sigpq/core/service/config/Estados-para-Funcionario.service';
import { SituacaoEstadoService } from '@resources/modules/sigpq/core/service/config/Situacao-Estado.service';
import { AuthService } from '@core/authentication/auth.service';
import { TipoCarreiraOuCategoriaService } from '@resources/modules/sigpq/core/service/config/Tipo-carreira-ou-categoria.service';
import { UtilsHelper } from '@core/helper/utilsHelper';

@Component({
  selector: 'app-listar-passivo',
  templateUrl: './listar-passivos.component.html',
  styleUrls: ['./listar-passivos.component.css'],
})
export class ListarPassivoComponent implements OnInit, OnDestroy {
  public estados = [
    {
      cor: 'rgb(254, 176, 25)',
      texto: 'Em licença',
    },
    {
      cor: 'red',
      texto: 'Vencido',
    },
  ];

  public funcionarios: any[] = [];

  public tipoVinculos: Array<Select2OptionData> = [];
  public regimes: Array<Select2OptionData> = [];
  public patenteClasses: Array<Select2OptionData> = [];
  public patentes: Array<Select2OptionData> = [];
  public tipoOrgaos: Array<Select2OptionData> = [];
  public orgaos: Array<Select2OptionData> = [];
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public situacaoEstados: Array<Select2OptionData> = [];
  public estado: Array<Select2OptionData> = [];
  public tituloSituacao: string = 'Passivo';
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
  efeitoModal: 'visualizar' | 'atualizar' | 'retomar' = 'visualizar';

  public isLoading: boolean = false;
  public pagination = new Pagination();

  totalBase: number = 0;

  filtro: any = {
    page: 1,
    perPage: 5,
    regimeId: 'null',
    patenteId: 'null',
    patenteClasse: 'null',
    tipoVinculoId: 'null',
    tipoOrgaoId: 'null',
    situacaoId: 'null',
    forcaPassiva: 'null',
    estadoId: 'null',
    orgaoId: 'null',
    genero: 'null',
    search: '',
    idadeMais: 'null',
    idadeMenos: 'null',
    excluir_efectividade_e_inactividade: 'null',
    anoMais: 'null',
    anoMenos: 'null',
    dashboard: false,
  };

  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
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
    private route: ActivatedRoute
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
  ngOnDestroy(): void {}

  ngOnInit() {
    this.buscarRegimes();
    this.buscarTipoEstruturaOrganica();
    this.buscarSituacaoEstados();
    // this.buscarClasses()
    this.validarBuscaDeAgentes();
  }

  private buscarSituacaoEstados() {
    this.situacaoEstadoService
      .listarTodos({})
      .pipe()
      .subscribe({
        next: (response: any) => {
          let aux = response
            .filter(
              (item: any) =>
                item.nome !== 'Efectividade' && item.nome !== 'Efetividade'
            )
            .filter(
              (item: any) =>
                item.nome !== 'Inactivo' && item.nome !== 'Inactivo'
            );

          // Mapeia os resultados e define a estrutura desejada
          this.situacaoEstados = aux.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
          this.situacaoEstados.push({ id: 'null', text: 'Todos' });

          // Aqui você já tem a lista de `situacaoEstados` pronta
        },
      });
  }

  toggleAgenteSelecionado(
    agente: any,
    efeito: 'visualizar' | 'atualizar' | 'retomar' = 'visualizar'
  ) {
    this.agenteSelecionado = agente;
    this.efeitoModal = efeito;
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

  public get buscarValor() {
    return this.activatedRoute.snapshot.queryParamMap.get('valor');
  }

  public get buscarId() {
    return this.activatedRoute.snapshot.queryParamMap.get('id');
  }

  validarAlgunsFiltros() {
    if (!this.filtro.regimeId) {
      this.filtro.patenteClasse = 'null';
      this.filtro.patenteId = 'null';
    }

    /// this.filtro.situacaoId=this.type.name=='fora-de-atividade'?'5':this.type.name=='Inactivo'?'6':'4'
    if (this.filtro.situacaoId == 'null') {
      this.filtro.excluir_efectividade_e_inactividade = [1, 6];
    } else this.filtro.excluir_efectividade_e_inactividade = 'null';
  }
  buscarFuncionario() {
    this.validarAlgunsFiltros();
    this.filtro.page = this.filtro.page || 1;
    this.filtro.perPage = this.filtro.perPage || 5;
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

  calcularFimInatividade(data_inicio: string, duracao: number): string {
    if (duracao == -1) return 'Sem data';
    else if (duracao > 0) {
      return this.calcularDataFinal(data_inicio, duracao);
    }
    return 'S/N';
  }

  calcularDataFinal(dataInicial: string, duracaoDias: number): string {
    // Converte a string da data inicial em um objeto Date
    const [dia, mes, anoHora] = dataInicial.split('/');
    const [ano, hora] = anoHora.split(' ');

    const data = new Date(`${ano}-${mes}-${dia}T${hora}`); // Formato: yyyy-mm-ddTHH:mm:ss

    // Adiciona a duração em dias
    data.setDate(data.getDate() + duracaoDias);

    // Formata a data final de volta para o formato desejado
    const diaFinal = String(data.getDate()).padStart(2, '0');
    const mesFinal = String(data.getMonth() + 1).padStart(2, '0'); // Os meses em JavaScript começam do zero
    const anoFinal = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');

    return `${diaFinal}/${mesFinal}/${anoFinal} ${horas}:${minutos}:${segundos}`;
  }

  inatividadeExpirada(dataFinal: string): Boolean {
    // Converte a string da data final para um objeto Date
    const [dia, mes, anoHora] = dataFinal.split('/');
    const [ano, hora] = anoHora.split(' ');

    const dataFim = new Date(`${ano}-${mes}-${dia}T${hora}`); // Formato: yyyy-mm-ddTHH:mm:ss

    // Obtém a data atual
    const dataAtual = new Date();

    // Compara as datas
    return dataFim < dataAtual; // Retorna true se a inatividade expirou
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
          .map((item: any) => ({ id: item.id, text: item.nome }));
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
    }

    if (reiniciar) {
      this.filtro.page = 1;
    }

    this.filtro.dashboard = false;
    sessionStorage.setItem(
      'buscaUsuarioForaDaEfetividade',
      JSON.stringify(this.filtro)
    );
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
      } else if (id == 'forcaPassiva') {
        this.filtro.forcaPassiva = valor;
      }
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
    this.filtro.situacaoId = '5';
    this.filtro.estadoId = 'null';
    this.filtro.orgaoId = 'null';
    this.filtro.genero = 'null';
    this.filtro.idadeMenos = 'null';
    this.filtro.idadeMais = 'null';
    this.filtro.anoMais = 'null';
    this.filtro.anoMenos = 'null';
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
}
