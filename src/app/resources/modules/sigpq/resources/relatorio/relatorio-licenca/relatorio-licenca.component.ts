import { Component, OnInit } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { PatenteService } from '@core/services/Patente.service';
import { PessoaFisicaService } from '@core/services/PessoaFisica.service';
import { RegimeService } from '@core/services/Regime.service';
import { TipoVinculoService } from '@resources/modules/sigpq/core/service/Tipo-vinculo.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { finalize, first } from 'rxjs';
import { TipoLicencasService } from '../../../core/service/TipoLicencas.service';
import { funcaoGenericaGerarAnos, funcaoGenericaGerarMeses } from '../../../../../../core/functions/functions';
import { TipoCarreiraOuCategoriaService } from '../../../core/service/config/Tipo-carreira-ou-categoria.service';
import { RelatorioLicencaService } from '../../../core/service/Relatorio-licenca.service';
import { TipoEstruturaOrganica } from '../../../../../../core/services/config/TipoEstruturaOrganica.service';

@Component({
  selector: 'app-sigpq-relatorio-licenca',
  templateUrl: './relatorio-licenca.component.html',
  styleUrls: ['./relatorio-licenca.component.css']
})
export class RelatorioLicencaComponent implements OnInit {

  public tipoVinculos: Array<Select2OptionData> = []
  public regimes: Array<Select2OptionData> = []
  public patenteClasses: Array<any> = []
  public patentes: Array<Select2OptionData> = []
  public patentes_: any
  public tipoCarreiraOuCategorias: Array<Select2OptionData> = []
  public tipoCarreiraOuCategorias_: any

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
  submited: boolean = false
  fileUrl: any = null


  public anos: Array<Select2OptionData> = []
  public meses: Array<Select2OptionData> = []
  public _tipolicencas: Array<Select2OptionData> = []
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%',
  }

  optionsMultiplo: any = {
    placeholder: "Selecione uma opção",
    width: '100%',
    multiple: true
  }

  filtro = {
    page: 1,
    perPage: 10,
    regimeId: 'null',
    patenteId: 'null',
    patenteClasse: 'null',
    tipoVinculoId: 'null',
    tipoOrgaoId: 'null',
    orgaoId: 'null',
    genero: 'null',
    //pessoaEstadoId: 'Activo',
    mes: 'null',
    ano:'null',
    tipo_licenca_id:'null',
    licenca_name:'null',
    situacao_do_dia_da_licenca:'aprovado',
    situacaoId:1, //EFECTIVO
    licenca_disciplinar: 'true'
  }

  opcoesDoSelector: any = []
  relatorioArr: any = []
  public regimes_: any = null
  public regimeQuadro: any = null

  valoresSelecionados: string[] = [];

  constructor(
    private sec: SecureService,
    private regimeService: RegimeService,
    private patenteService: PatenteService,
    private relatorioService: RelatorioLicencaService,
    private tipoVinculoService: TipoVinculoService,
    private pessoaFisicaService: PessoaFisicaService,
    private tipoLicenca:TipoLicencasService,
    private tipoCarreiraOuCategoriaService: TipoCarreiraOuCategoriaService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService) {
    this.orgaos.push({
      id: 'null',
      text: 'Todos'
    })
  }

  ngOnInit(): void {
    this.buscarOpcoesDoSelector()
    this.buscarRegimes()
    this.inicializarPostos()
    this.inicializarClasses()
    this.buscarTipoVinculo()
    this.buscarPessoaEstado()
    this.preencherLicencas()
    this.preencherAnoEMesPadrao()
    this.buscarTipoEstruturaOrganica()
  }

  preencherAnoEMesPadrao() {
    // Preencher os anos de 2020 até 2030
    this.anos=funcaoGenericaGerarAnos()

    this.meses=funcaoGenericaGerarMeses()
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


   preencherLicencas() {

    const opcao = {
      /* ...this.filtro,
      pessoafisica_id: this.pessoaId */
    }

    this.tipoLicenca.listar(opcao).pipe().subscribe({
        next: (response: any) => {
          const org = response.map((item: any) => ({ id: item.id, text: item.nome }));
      this._tipolicencas=org // Preenchendo a variável
        }
      })
  }

  // Função que retorna o nome da licença com base no ID
getNomeLicencaById(id: string): string {
  const licenca = this._tipolicencas.find(item => item.id == id);
  return licenca ? licenca.text : ''
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
          this.regimes_ = response
        })

      })
  }

  public validarRegime($event: any): void {
    const [regime_] = this.regimes_.filter((item: any) => item.id == $event)
    this.regimeQuadro = regime_?.quadro
    /* console.log("Regime selecionado:",this.regimeQuadro=="I") */


    this.buscarTipoCarreiraOuCategoria($event)

    const regimes = this.regimes.filter(regime => regime.id == $event)
    const [regime] = regimes
    this.buscarTipoVinculo(regime)

  }

  private inicializarClasses()
  {
    this.tipoCarreiraOuCategorias=[];
    this.tipoCarreiraOuCategorias.push({
      id: 'null',
      text: 'Todos'
    });
    this.filtro.patenteClasse='null'
  }
  private buscarTipoCarreiraOuCategoria(event: any): void {

    if(!event) return
    else if (event=='null') { this.inicializarClasses(); return}

    const opcoes = {
      regime_id: event
    }
    this.tipoCarreiraOuCategoriaService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.tipoCarreiraOuCategorias = response.map((item: any) => ({ id: item.id, text: item.nome }))
        this.tipoCarreiraOuCategorias_ = response;

      })
  }



  private inicializarPostos()
  {
    this.patentes=[]
    this.patentes.push({
      id: 'null',
      text: 'Todos'
    });
    this.filtro.patenteId='null'
  }

   public buscarPatentes($event: any) {
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

  private buscarTipoVinculo(options: any = null): void {
    if (!options) return

    const opcoes = {
      regime: options.text
    }
    this.tipoVinculoService.listar(opcoes)
      .pipe(
        finalize((): void => {
          if (options?.id == 1) {
            this.tipoVinculos = this.tipoVinculos.filter((item: any) => item?.id == 1)
          }
        })
      )
      .subscribe((response: any): void => {
        this.tipoVinculos = response.map((item: any) => ({ id: item.id, text: item.nome }))

      })
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

  }

  validarSelecionados(): boolean {
    return !this.filtro.tipo_licenca_id && !this.filtro.ano && !this.filtro.mes
    //return this.valoresSelecionados.length < 2
  }

  onSubmit() {

    if (this.carregando) {
      return
    }

    this.carregando = true
    // this.submited = true filtro.patenteClasse


    this.filtro.licenca_name=this.getNomeLicencaById(this.filtro.tipo_licenca_id)
     const { page, ...filtroSemPagina } = this.filtro;
    const options = {
      ...(this.filtro.perPage == -1 ? filtroSemPagina : this.filtro),
      //titulo: this.tipoDeDeclaracao,
      gerarRelatorio: true,
      valoresSelecionados: this.valoresSelecionados || []  // Adicionado valor padrão
    };

    this.relatorioService.gerar(options)
      .pipe(
        first(),
        finalize(() => {
          this.carregando = false;
        })
      ).subscribe((response) => {
        console.log("Opções de envio:",options)
        console.log("RESULTADO DA GERAÇÃO:",response)
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
