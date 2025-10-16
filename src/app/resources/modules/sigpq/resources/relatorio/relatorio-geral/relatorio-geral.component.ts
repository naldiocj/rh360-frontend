import { Component, OnInit } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { PatenteService } from '@core/services/Patente.service';
import { PessoaFisicaService } from '@core/services/PessoaFisica.service';
import { RegimeService } from '@core/services/Regime.service';
import { RelatorioService } from '@resources/modules/sigpq/core/service/Relatorio.service';
import { TipoVinculoService } from '@resources/modules/sigpq/core/service/Tipo-vinculo.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { finalize, first } from 'rxjs';
import { TipoEstruturaOrganica } from '../../../../../../core/services/config/TipoEstruturaOrganica.service';
import { TipoCarreiraOuCategoriaService } from '../../../core/service/config/Tipo-carreira-ou-categoria.service';
import { SituacaoEstadoService } from '../../../core/service/config/Situacao-Estado.service';
import { EstadosParaFuncionario } from '../../../core/service/config/Estados-para-Funcionario.service';

@Component({
  selector: 'app-sigpq-relatorio-geral',
  templateUrl: './relatorio-geral.component.html',
  styleUrls: ['./relatorio-geral.component.css']
})
export class RelatorioGeralComponent implements OnInit {

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

  carregandoOpcoesDoSelector: boolean = false
  carregando: boolean = false
  public carregando_declaracao: boolean = false;
  submited: boolean = false
  fileUrl: any = null
  tipoDeDeclaracao:string = ''
  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%',
  }

  optionsMultiplo: any = {
    placeholder: "Selecione uma opção",
    width: '100%',
    multiple: true
  }

 /*  filtro = {
    regimeId: 'null',
    patenteId: 'null',
    patenteClasse: 'null',
    tipoVinculoId: 'null',
    tipoOrgaoId: 'null',
    orgaoId: 'null',
    genero: 'null',
    pessoaEstadoId: 'null',
  } */
public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
public tipoCargos: Array<Select2OptionData> = []
public tipoOrdenacao: Array<Select2OptionData> = [];
public situacaoEstados: Array<Select2OptionData> = [];
public estado: Array<Select2OptionData> = [];
 public idadeMenos = 18;
  filtro = {
    page: 1,
    perPage: 10,
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
    dashboard: true,
  };

  opcoesDoSelector: any = []
  relatorioArr: any = []
public tituloSituacao: string = 'Passivo'
  valoresSelecionados: string[] = [];

  constructor(
    private sec: SecureService,
    private regimeService: RegimeService,
    private patenteService: PatenteService,
    private relatorioService: RelatorioService,
    private tipoVinculoService: TipoVinculoService,
    private pessoaFisicaService: PessoaFisicaService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
    private tipoCarreiraOuCategoriaService: TipoCarreiraOuCategoriaService,
    private estadosParaFuncionarioService: EstadosParaFuncionario,
    private situacaoEstadoService: SituacaoEstadoService) {
    this.orgaos.push({
      id: 'null',
      text: 'Todos'
    })
  }

  ngOnInit(): void {
    this.buscarOpcoesDoSelector()
    this.buscarPessoaEstado()
    this.buscarTipoEstruturaOrganica()
    this.fillTipoOrdenacao()
    this.buscarSituacaoEstados()
  }

  private buscarSituacaoEstados() {

    this.situacaoEstadoService.listarTodos({}).pipe().subscribe({
      next: (response: any) => {
        let aux = response
          //.filter((item: any) => item.nome !== "Efectividade" && item.nome !== "Efetividade")
          //.filter((item: any) => item.nome !== "Inactivo" && item.nome !== "Inactivo");

        // Mapeia os resultados e define a estrutura desejada
        this.situacaoEstados = aux.map((item: any) => ({ id: item.id, text: item.nome }));
        this.situacaoEstados.push({id:'null',text:'Todos'})


        // Aqui você já tem a lista de `situacaoEstados` pronta
      }
    });

  }

  fillTipoOrdenacao() {
    this.tipoOrdenacao.push({
      id: 'null',
      text: 'Padrão',
    });
    this.tipoOrdenacao.push({ id: 'PATENTE', text: 'Patente' });
    this.tipoOrdenacao.push({ id: 'NIP', text: 'Nip' });
    this.tipoOrdenacao.push({ id: 'NOME', text: 'Nome' });

    this.buscarRegimes()
  }

  private buscarTipoEstruturaOrganica() {
    this.estruturaOrganicaServico
      .listar({})
      .pipe(finalize((): void => { }))
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
      this.selecionarSituacaoLaboral($e)
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

  public selecionarSituacaoLaboral($event: any) {
    this.tituloSituacao = ''

    if (!$event || $event == 'null') return
    const [situacao] = this.situacaoEstados
      .filter((item: any) => item.id == $event)
    if (!situacao) return

    this.tituloSituacao = situacao.text

    const options = {
      sigpq_situacao_estado_id: $event
    }

    this.estadosParaFuncionarioService.
      listarTodos(options).pipe().subscribe({
        next: (response: any) => {
          this.estado = []
          this.estado.push({
            id: 'null',
            text: 'Todos'
          })
          const aux = response
            .map((item: any) => ({ id: item.id, text: item.nome }))

          this.estado.push(...aux)
        }
      })
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
    const opcoes = {};

    this.regimeService
      .listar(opcoes)
      .pipe(finalize((): void => { }))
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
      .pipe(finalize((): void => { }))
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

  buscarTipoVinculo($event: any): void {
    //this.mostrarCarreira = false;
    this.tipoVinculos = [];
    if (!$event || $event == 'null') return;

    /* if ($event == 1) {
      this.mostrarCarreira = true;
    } else {
      this.mostrarCarreira = false;
    } */

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
      .pipe(finalize((): void => { }))
      .subscribe((response: any): void => {
        this.patenteClasses = [];
        this.patenteClasses.push({
          id: 'null',
          text: 'Todos',
        });

        let aux: any = response
          .filter((item: any) => item.nome.toUpperCase() !== "Tesoureiro".toUpperCase())
          .map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        this.patenteClasses.push(...aux);
        // this.tipoCarreiraOuCategorias = response.map((item: any) => ({ id: item.id, text: item.nome }))
        // this.tipoCarreiraOuCategorias_ = response;
      });
  }

  selecionarOrgaoOuComandoProvincial($event: any): void {
    if (!$event) return;

    const opcoes = {
      tipo_estrutura_sigla: $event,
    };
    this.direcaoOuOrgaoService
      .listarTodos(opcoes)
      .pipe(finalize((): void => { }))
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

  validarSelecionados(): boolean {
    return this.valoresSelecionados.length < 2
  }

  onSubmit() {

    if (this.carregando) {
      return
    }

    this.carregando = true
    this.carregando_declaracao=true;
    // this.submited = true
    const { page, ...filtroSemPagina } = this.filtro;
    const options = {
      ...(this.filtro.perPage == -1 ? filtroSemPagina : this.filtro),
      titulo: this.tipoDeDeclaracao,
      gerarRelatorio: true,
      valoresSelecionados: this.valoresSelecionados || []  // Adicionado valor padrão
    };


    this.relatorioService.gerar(options)
      .pipe(
        first(),
        finalize(() => {
          this.carregando = false;
          this.carregando_declaracao=false;
        })
      ).subscribe((response) => {
        this.fileUrl = this.relatorioService.createImageBlob(response);

      });

  }

  fecharModalRelatorio() {
    this.submited = false
    this.carregando = false
    this.carregando_declaracao=false;
    this.fileUrl = null
    this.relatorioService.cancelarGeracaoRelatorio()
  }

  get getAuth() {
    return this.sec.getTokenValueDecode()
  }

  gerarDeclaracao() {
  this.carregando_declaracao=true;
  this.onSubmit()

  }

}
