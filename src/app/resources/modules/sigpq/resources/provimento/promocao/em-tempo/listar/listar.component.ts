import { Component, OnInit, ViewChild } from '@angular/core';
import { ProvimentoService } from '@resources/modules/sigpq/core/service/Provimento.service';

import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';
import { PromoverModalComponent } from '../promover-modal/promover-modal.component';
import { Select2OptionData } from 'ng-select2';
import { TipoVinculoService } from '@resources/modules/sigpq/core/service/Tipo-vinculo.service';
import { PatenteService } from '@core/services/Patente.service';
import { RegimeService } from '@core/services/Regime.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { SecureService } from '@core/authentication/secure.service';
import { SituacaoEstadoService } from '@resources/modules/sigpq/core/service/config/Situacao-Estado.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { EstadosParaFuncionario } from '@resources/modules/sigpq/core/service/config/Estados-para-Funcionario.service';
import { TipoCarreiraOuCategoriaService } from '@resources/modules/sigpq/core/service/config/Tipo-carreira-ou-categoria.service';
import { ActoProgressaoService } from '@resources/modules/sigpq/core/service/config/Acto-Progressao.service';
import { PropostaProvimentoService } from '@resources/modules/sigpq/core/service/PropostaProvimento.service';
import { AuthService } from '@core/authentication/auth.service';

@Component({
  selector: 'app-sigpq-provimento-promocao-em-tempo-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent implements OnInit {
  @ViewChild('promoverModalComponent')
  public promoverModalComponent!: PromoverModalComponent;

  public pagination = new Pagination();
  public pessoaId: number | null = null;

  emTempos: any[] = [];
  emTempo: any;
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
    estadoId: 'null',
    orgaoId: 'null',
    genero: 'null',
    search: '',
    idadeMais: 'null',
    idadeMenos: 'null',
    anoMais: 'null',
    anoMenos: 'null',
    emTempo: 'null',
    semTempo: 'null',
    dashboard: false,
    sigpq_acto_progressao_id: 'null',
  };
  public idadeMenos = 18;

  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  public tipoVinculos: Array<Select2OptionData> = [];
  public regimes: Array<Select2OptionData> = [];
  public patenteClasses: Array<any> = [];
  public patentes: Array<Select2OptionData> = [];
  public tipoOrgaos: Array<Select2OptionData> = [];
  public orgaos: Array<Select2OptionData> = [];
  public situacaoEstados: Array<Select2OptionData> = [];
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public estado: Array<Select2OptionData> = [];
  public tituloSituacao: string = '';
  public isLoading: boolean = false;
  public mostrarCarreira = false;
  public agentesSelecionados: any = [];
  public actoProgressaos: Array<Select2OptionData> = [];

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

  constructor(
    private provimentoService: ProvimentoService,
    private propostaProvimentoService: PropostaProvimentoService,
    private tipoVinculoService: TipoVinculoService,
    private patenteService: PatenteService,
    private regimeService: RegimeService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private situacaoEstadoService: SituacaoEstadoService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
    private estadosParaFuncionarioService: EstadosParaFuncionario,
    private tipoCarreiraOuCategoriaService: TipoCarreiraOuCategoriaService,
    private actoProgressaoService: ActoProgressaoService,
    public authService:AuthService,

    private sec: SecureService
  ) {
    this.orgaos.push({
      id: 'null',
      text: 'Todos',
    });
  }

  ngOnInit(): void {
    this.buscarPromocaoEmTempo();
    // this.buscarRegimes()
    this.buscarRegimes();
    // this.buscarClasses()
    this.buscarTipoEstruturaOrganica();
    this.buscarSituacaoEstados();
    this.buscarActoProgressao();
    this.atribuirNullCheckBox('semTempo');
    this.atribuirNullCheckBox('emTempo');
  }

  public buscarActoProgressao(): void {
    const opcoes = {};
    this.actoProgressaoService
      .listar(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.actoProgressaos = [];
        this.actoProgressaos.push({
          id: 'null',
          text: 'Todos',
        });

        let aux: any = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
        this.actoProgressaos.push(...aux);
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
          this.situacaoEstados = [];
          this.situacaoEstados.push({
            id: 'null',
            text: 'Todos',
          });
          this.situacaoEstados.push(...aux);
        },
      });
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

  private buscarClasses(): void {
    const opcoes = {};
    let todos = true;

    const PClass: any = [];
    const AuxPClass = new Set();

    this.patenteService
      .listar(opcoes)
      .pipe(
        finalize((): void => {
          const patenteClasses = PClass.filter((pc: any) => {
            const duplicadoPatente = AuxPClass.has(pc.id);
            AuxPClass.add(pc.id);
            return !duplicadoPatente;
          });
          let aux: any = patenteClasses.map((item: any) => ({
            id: item.id,
            text: item.text,
          }));

          this.patenteClasses = [];
          this.patenteClasses.push({
            id: 'null',
            text: 'Todos',
          });
          this.patenteClasses.push(...aux);
        })
      )
      .subscribe({
        next: (response: any) => {
          response.map((item: any) => {
            PClass.push({ id: item.classe, text: item.classe });
          });
        },
      });
  }
  private buscarPatentes($event: any) {
    if (!$event || $event == 'null') return;

    const options = {
      sigpq_tipo_carreira_id: $event,
    };

    this.patenteService
      .listar(options)
      .pipe()
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
      });
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

        this.tipoEstruturaOrganicas.push(...org);
      });
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
    this.filtro.semTempo = 'null';
    this.filtro.emTempo = 'null';
    this.filtro.anoMenos = 'null';
    this.filtro.situacaoId = 'null';
    this.filtro.sigpq_acto_progressao_id = 'null';
    this.filtro.dashboard = false;
    this.buscarPromocaoEmTempo();
    this.atribuirNullCheckBox('semTempo');
    this.atribuirNullCheckBox('emTempo');
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

        let aux: any = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
        this.patenteClasses.push(...aux);
      });
  }

  buscarPromocaoEmTempo() {
    const options = { ...this.filtro };
    this.isLoading = true;

    this.propostaProvimentoService
      .listar_promocao_emTempo(options)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response: any) => {
        this.emTempos = response.data;

        console.log(response.data);

        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  novoAcidente() {
    // this.emTempo = new AcidenteModel()
  }

  setAvaria(item: any) {
    this.emTempo = item;
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
    } else if (key == 'vencida') {
      this.filtro.semTempo = $e.target.value;
      this.atribuirNullCheckBox('emTempo');
    } else if (key == 'naoVencida') {
      this.filtro.emTempo = $e.target.value;
      this.atribuirNullCheckBox('semTempo');
    } else if (key == 'tipoActo') {
      this.filtro.sigpq_acto_progressao_id = $e;
    }
    this.buscarPromocaoEmTempo();
  }

  setEmTempo(item: any) {
    this.emTempo = item;
  }

  atribuirNullCheckBox(id: any) {
    if (!this.filtro.hasOwnProperty(id)) return;
    this.filtro[id] = 'null';
    const element: HTMLInputElement = document.querySelector(
      `#${id}`
    ) as HTMLInputElement;
    if (element) {
      element.checked = false;
    }
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

  public get getTemAgentesSelecionados(): boolean {
    return this.agentesSelecionados.length > 0;
  }
  public get getMaisAgentesSelecionados(): boolean {
    return (
      this.getTemAgentesSelecionados && this.agentesSelecionados.length > 1
    );
  }

  public setPessoaId(pessoaId: any) {
    this.pessoaId = pessoaId;
  }
}
