import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { EstadoCivilService } from '@core/services/EstadoCivil.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { PaisService } from '@core/services/Pais.service';
import { PatenteService } from '@core/services/Patente.service';
import { ProvinciaService } from '@core/services/Provincia.service';
import { RegimeService } from '@core/services/Regime.service';
import { EmployeeService } from '@core/services/Employee.service';
import { CursoService } from '@core/services/config/Curso.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { TipoSanguineoService } from '@core/services/config/TipoSanguineo.service';
import { TipoCargoService } from '@resources/modules/sigpq/core/service/Tipo-cargo.service';
import { TipoHabilitacaoLiterariaService } from '@resources/modules/sigpq/core/service/Tipo-habilitacao-literaria.service';
import { TipoVinculoService } from '@resources/modules/sigpq/core/service/Tipo-vinculo.service';
import { ActoNomeacaoService } from '@resources/modules/sigpq/core/service/config/Acto-Nomeacao.service';
import { ActoProgressaoService } from '@resources/modules/sigpq/core/service/config/Acto-Progressao.service';
import { DistritoService } from '@resources/modules/sigpq/core/service/config/Distrito.service';
import { EstadosParaFuncionario } from '@resources/modules/sigpq/core/service/config/Estados-para-Funcionario.service';
import { MunicipioService } from '@resources/modules/sigpq/core/service/config/Municipio.service';
import { SituacaoEstadoService } from '@resources/modules/sigpq/core/service/config/Situacao-Estado.service';
import { TipoCarreiraOuCategoriaService } from '@resources/modules/sigpq/core/service/config/Tipo-carreira-ou-categoria.service';
import { TipoFuncaoService } from '@resources/modules/sigpq/core/service/config/TipoFuncao.service';
import { UtilService } from '@resources/modules/sigpq/core/utils/util.service';
import { TipoOutroDadoModel } from '@resources/modules/sigpq/shared/model/tipo-outro-dado.model';
import { FuncionarioValidation } from '@resources/modules/sigpq/shared/validation/funcionario.validation';
import { DepartamentoService } from '@shared/services/config/Departamento.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { SeccaoService } from '@shared/services/config/Seccao.service';
import { UnidadeService } from '@shared/services/config/Unidade.service';
import { event } from 'jquery';
import { Select2OptionData } from 'ng-select2';
import { Subject, finalize, first, takeUntil } from 'rxjs';
import { AppConfig } from '../../../../../../../config/app.config';

@Component({
  selector: 'sigpq-dados-pessoais-profissional',
  templateUrl: './dados-pessoais-profissional.component.html',
  styleUrls: ['./dados-pessoais-profissional.component.css'],
})
export class DadosPessoaisProfissionalComponent implements OnInit, OnDestroy {
  @Input() public options: any;
  @Input() public params: any;
  @Input() simpleForm!: FormGroup;

  public tabCount: number = 0;
  tituloVinculo: string = '';

  public abrirCameraCivil: boolean = false;
  public abrirCameraEfectivo: boolean = false;
  public abrirCamera: boolean = false;

  public fileUrlEfectivo: any = null;
  public fileUrlCivil: any = null;
  public formError: any;
  public optionsSelectLanguage: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
    multiple: true,
  };

  public agenteFora: boolean = false;
  public regimeQuadro: any = null;

  public formErrors: any;
  public regimeTipo: boolean = false;
  public edit: boolean = false;
  public selectedPatente: number = 0;

  tituloPrincipal =
    AppConfig.orgName; /* Ex: Policia Nacional de Angola OU Serviços  I ... */
  introApp =
    AppConfig.introApp; /* Ex: Sistema Integrado de Gestao de pessoal e quadros */
  siglaPrincipal = AppConfig.siglaPrincipal; /* Ex: PNA */
  logoPath = AppConfig.logoPath; /* Ex: LOGOTIPO */
  logoBack = AppConfig.logoBack; /* Ex: LOGOTIPO DE FUNDO */
  logoH = AppConfig.logoH; /* Ex: LOGOTIPO DE HEADER */
  imgUser = AppConfig.imgUser; /* Ex: Imagem user */
  useColor = AppConfig.useColor; /* Ex: COR DO TEMA */
  useGradient = AppConfig.useGradient; /* Ex: COR DO GRADIENTE */
  colorPainel = AppConfig.colorPainel; /* Ex: COR DO PAINEL */

  public regimes: Array<Select2OptionData> = [];
  public cursos: Array<Select2OptionData> = [];
  public paises: Array<Select2OptionData> = [];
  public provincias: Array<Select2OptionData> = [];
  public estadoCivils: Array<Select2OptionData> = [];
  public tipoSanguineos: Array<Select2OptionData> = [];
  public tipoHabilitacaoLiterarias: Array<Select2OptionData> = [];
  public tipoVinculos: Array<Select2OptionData> = [];
  public regimes_: any = null;
  public vinculos: Array<Select2OptionData> = [];
  public tipoCarreiraOuCategorias: Array<Select2OptionData> = [];
  public tipoCarreiraOuCategorias_: any;
  public tipoCargos: Array<Select2OptionData> = [];
  public estado: Array<Select2OptionData> = [];
  public estadoReformas: Array<Select2OptionData> = [];
  public direcaoOuOrgao: Array<Select2OptionData> = [];
  public numero_camisas: Array<Select2OptionData> = [
    {
      id: 'XS',
      text: 'XS - Extra Pequeno',
    },
    {
      id: 'S',
      text: 'S - Pequeno',
    },
    {
      id: 'M',
      text: 'M - Médio',
    },
    {
      id: 'L',
      text: 'L - Grande',
    },
    {
      id: 'XL',
      text: 'XL - Extra Grande',
    },
  ];

  public colocaoOrgao: boolean = false;
  public formatAccept = ['.png', '.jpg', '.jpeg'];
  public patentes_: any;
  public validarDataNascimento = this.formatarDataHelper.getPreviousDate(
    18,
    0,
    0,
    'yyyy-MM-dd'
  );
  public patentes: Array<Select2OptionData> = [];
  public tituloSituacao: string = '';
  public tituloSituacaoLaboral: string = '';
  public tipoOrgao: string = '';
  public _direcaoOuOrgao: any;

  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
    { id: 'Orgão', text: 'Orgão Central' },
  ];

  public submitted: boolean = false;
  public isLoading: boolean = false;

  public validarDataAdesao = this.formatarDataHelper.getPreviousDate(
    0,
    0,
    0,
    'yyyy-MM-dd'
  );
  public tipoOutrosDados: TipoOutroDadoModel[] = [];
  public tipoFuncaos: Array<Select2OptionData> = [];
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public municipios: Array<Select2OptionData> = [];
  public distritos: Array<Select2OptionData> = [];
  public departamentos: Array<Select2OptionData> = [];
  public seccoes: Array<Select2OptionData> = [];
  public unidades: Array<Select2OptionData> = [];
  public situacaoEstados: Array<Select2OptionData> = [];
  public brigadas: Array<Select2OptionData> = [];

  _validarDataNascimento: any = '';
  idadeInvalida = false;

  public categoriaSelecionada: any;

  public seccao: any = '';
  public brigada: any = '';

  private destroy$ = new Subject<void>();
  public actoProgressaos: Array<Select2OptionData> = [];
  public actoNomeacaos: Array<Select2OptionData> = [];

  constructor(
    private tipoHabilitacaoLiterariaService: TipoHabilitacaoLiterariaService,
    public funcionarioValidacao: FuncionarioValidation,
    private estadoCivilService: EstadoCivilService,
    private formatarDataHelper: FormatarDataHelper,
    private tipoSanguineo: TipoSanguineoService,
    private provinciaService: ProvinciaService,
    private cursoService: CursoService,
    private paisService: PaisService,
    private regimeService: RegimeService,
    private employeeService: EmployeeService,
    private actoProgressaoService: ActoProgressaoService,
    private actoNomeacaoService: ActoNomeacaoService,
    private ficheiroService: FicheiroService,
    private tipoVinculoService: TipoVinculoService,
    private tipoCarreiraOuCategoriaService: TipoCarreiraOuCategoriaService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private fb: FormBuilder,
    private patenteService: PatenteService,
    private tipoCargoService: TipoCargoService,
    private tipoFuncaoService: TipoFuncaoService,
    private funcionarioServico: FuncionarioService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
    private router: Router,
    private estadosParaFuncionarioService: EstadosParaFuncionario,
    private municipioService: MunicipioService,
    private distritoService: DistritoService,
    private seccaoService: SeccaoService,
    private departamentoService: DepartamentoService,
    private situacaoEstadoService: SituacaoEstadoService,
    private unidadeService: UnidadeService,
    private utilService: UtilService
  ) {
    this.formErrors = this.funcionarioValidacao.errorMessages;
    // Define a data máxima como hoje
    this.validarDataNascimento = new Date().toISOString().split('T')[0];
  }

  private buscarSituacaoEstados() {
    const options = {};

    this.situacaoEstadoService
      .listarTodos({})
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.situacaoEstados = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }

  public buscarActoProgressao(): void {
    const opcoes = {};
    this.actoProgressaoService
      .listar(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.actoProgressaos = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }
  public buscarActoNomeacao(): void {
    const opcoes = {};
    this.actoNomeacaoService
      .listar(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.actoNomeacaos = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }

  verFoto(urlAgente: any, efectivo: boolean = false): boolean | void {
    if (!urlAgente) return false;
    const opcoes = {
      pessoaId: this.params.getId ?? this.params.getInfo,
      url: urlAgente,
    };

    this.isLoading = true;

    this.ficheiroService
      .getFile(opcoes)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((file) => {
        if (efectivo) {
          this.fileUrlEfectivo = this.ficheiroService.createImageBlob(file);
        } else {
          this.fileUrlCivil = this.ficheiroService.createImageBlob(file);
        }
      });
  }

  public get getPessoaId(): any {
    return this.params.getId ?? this.params.getInfo;
  }

  buscarUmFuncionario() {
    this.isLoading = true;
    this.funcionarioServico
      .buscarUm(this.params.getId || this.params.getInfo)
      .pipe(
        first(),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response: any) => {
        const n_passaporte = response.sigpq_documentos.find((o: any) => {
          if (
            !['Profissional', 'Pessoal'].includes(o.nid) &&
            o.sigpq_tipo_documento_id == 4
          ) {
            return true;
          }
          return false;
        });
        const carta_de_condusao = response.sigpq_documentos.find((o: any) => {
          if (
            !['Profissional', 'Pessoal'].includes(o.nid) &&
            o.sigpq_tipo_documento_id == 2
          ) {
            return true;
          }
          return false;
        });

        if (this.params.getInfo) {
          this.simpleForm.disable();
        }

        this.selecionarOrgaoOuComandoProvincial(
          response.sigpq_tipo_orgao?.tipo_estrutura_organica_sigla
        );

        this.validarDirecao(response.sigpq_tipo_orgao?.id);
        this.selecionarDepartamento(response.sigpq_tipo_departamento?.id);
        this.buscarSeccao(response?.sigpq_tipo_seccao?.id);
        this.verFoto(response.foto_efectivo, true);
        this.verFoto(response.foto_civil, false);
        this.validarCargo(response?.sigpq_cargo?.sigpq_acto_nomeacao_id);
        this.validarNomeacao(response?.sigpq_cargo?.sigpq_acto_nomeacao_id);
        this.handlerProvincias(response?.naturalidade_id);
        this.validarRegime(response?.regime_id);
        this.selecionarSituacaoLaboral(response?.sigpq_situacao_id);
        this.validarVinculo(response?.sigpq_tipo_vinculo_id);
        this.selecionarSituacaoLaboralLaboral(response?.sigpq_estado_id);
        if (response?.sigpq_habilitacao_literaria?.anexo) {
          $('#habitacao-literaria').css('border', '1px solid green');
        }

        this.simpleForm.patchValue({
          form_edit: true,
          simpleFormEdit: response,
          // nome_completo: `${response.nome_completo} ${response.apelido ?? ''}`,
          nome_completo: `${response.nome_completo}`,
          data_nascimento: this.formatarDataHelper.formatDate(
            response.data_nascimento
          ),
          genero: response.genero,
          sigpq_estado_id: response?.sigpq_estado_id,
          sigpq_estado_reforma_id: response?.sigpq_estado_reforma_id,
          sigpq_situacao_id: response?.sigpq_situacao_id,
          estado_civil_id: response?.estado_civil_id,
          naturalidade_id: response?.naturalidade_id,
          municipio_id: response?.municipio_id,
          distrito_id: response?.distrito_id,
          local_nascimento: response?.local_nascimento,

          foto_civil: response?.foto_civil,
          foto_efectivo: response?.foto_efectivo,
          anexo: response?.sigpq_provimento.anexo,
          // habilitacao_literaria_certificado: response?.sigpq_habilitacao_literaria?,

          residencia_bi: response?.sigpq_endereco?.residencia_actual,
          nid: response?.documento?.nid,
          data_expira: response?.documento?.data_expira
            ? this.formatarDataHelper.formatDate(
                response?.documento?.data_expira
              )
            : null,
          data_emissao: response?.documento?.data_emissao
            ? this.formatarDataHelper.formatDate(
                response?.documento?.data_emissao
              )
            : null,
          nome_pai: response?.nome_pai,
          nome_mae: response?.nome_mae,
          numero_passaporte: n_passaporte?.nid,
          data_expira_passaporte: n_passaporte?.data_expira
            ? this.formatarDataHelper.formatDate(n_passaporte?.data_expira)
            : null,

          residencia_actual: response?.sigpq_endereco?.residencia_actual,
          iban: response?.iban,
          numero_carta_conducao: carta_de_condusao?.nid,
          data_expira_carta_conducao: carta_de_condusao?.data_expira
            ? this.formatarDataHelper.formatDate(carta_de_condusao?.data_expira)
            : null,

          sigpq_tipo_habilitacao_literaria_id:
            response?.sigpq_habilitacao_literaria
              ?.sigpq_tipo_habilitacaoliteraria_id,

          sigpq_tipo_curso_id: response?.sigpq_curso?.sigpq_tipo_curso_id,
          pais_id: 1,

          sigpq_tipo_sanguineo_id: response?.sigpq_tipo_sanguineo_id,
          contacto: response?.sigpq_contacto_pessoal?.contacto,
          contacto_servico: response?.contacto_servico,
          contacto_alternativo: response?.sigpq_contacto_alternativo?.contacto,
          email: response?.email_pessoal,
          email_institucional: response?.email_servico,
          pseudonimo: response?.pseudonimo,
          regime_id: response?.regime_id,
          sigpq_tipo_vinculo_id: response?.sigpq_tipo_vinculo_id,
          sigpq_vinculo_id: response?.sigpq_vinculo_id,
          numero_despacho: response?.sigpq_provimento?.numero_despacho,
          numero_ordem: response?.sigpq_provimento?.numero_ordem,
          sigpq_acto_progressao_id:
            response?.sigpq_provimento?.acto_progressao_id,

          nip: response?.nip,
          niic: response?.niic,
          numero_agente: response?.numero_agente,
          orgao_id: response?.sigpq_tipo_orgao?.id,
          tipo_orgao: response?.tipo_estrutura_organica_id,
          pessoajuridica_id: response?.sigpq_tipo_orgao?.id,

          departamento_id: response?.sigpq_tipo_departamento?.id,

          seccao_id: response?.sigpq_tipo_seccao?.id,
          brigada_id: response?.sigpq_tipo_brigada?.id,

          data_despacho_nomeacao: this.formatarDataHelper.formatDate(
            response?.sigpq_cargo?.data
          ),
          numero_despacho_nomeacao: response?.sigpq_cargo?.numero_ordem,
          patente_id: response?.patente_id,
          data_ordem:
            this.formatarDataHelper.detectDateFormat(
              response?.sigpq_provimento?.ordem_data
            ) == 'yyyy-mm-dd'
              ? this.formatarDataHelper.formatDate(
                  response?.sigpq_provimento?.ordem_data
                )
              : null,
          data_despacho: this.formatarDataHelper.formatDate(
            response?.sigpq_provimento?.despacho_data
          ),
          sigpq_tipo_cargo_id: response?.sigpq_cargo?.sigpq_tipo_cargo_id,
          sigpq_acto_nomeacao_id: response?.sigpq_cargo?.sigpq_acto_nomeacao_id,
          sigpq_tipo_funcao_id: response?.tipo_funcao_id,
          sigpq_tipo_categoria_id:
            response?.sigpq_categoria?.sigpq_tipo_carreira_id,
          data_adesao: this.formatarDataHelper.formatDate(
            response?.data_adesao
          ),
          seccao: response?.seccao,
          brigada: response?.brigada,
          nps: response?.nps,
          linguas_internacionais: response?.linguas_internacionais,
          linguas_nacionais: response?.linguas_nacionais,
          numero_calcado: response?.numero_calcado,
          numero_camisa: response?.numero_camisa,
          motivo_situacao_laboral: response?.motivo_situacao_laboral,
          numero_calca: response?.numero_calca
        });
        this.selectedPatente = response?.patente_id;
        this.ajustarFotoFardado();
      });
  }

  ngOnInit(): void {
    this.listarPais();
    this.listarCursos();
    this.listarProvincias();
    this.buscarEstadoCivil();
    this.listarTipoSanguineo();
    this.buscarTipoHabilitacaoLiteraria();
    this.buscarRegime();
    this.buscarTipoVinculo();
    this.buscarSituacaoEstados();
    this.buscarTipoEstruturaOrganica();
    this.buscarTipoFuncao();
    this.buscarActoProgressao();
    this.buscarActoNomeacao();

    this.buscarCategorias();

    this.buscarTipoCargo();

    this.ajustarFotoFardado();
    this.criarForm();

    // Usar setTimeout para evitar ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.selecionarOrgaoOuComandoProvincial('SAT');
      if (this.params?.getId || this.params?.getInfo) {
        this.ajustarFotoFardado();

        if (this.params?.getId || this.params?.getInfo) {
          this.buscarUmFuncionario();
        }
      }
    }, 0);
  }

  _validarData(): void {
    const dataSelecionada = new Date(
      this.simpleForm.controls['data_nascimento'].value
    );
    const hoje = new Date();

    if (!dataSelecionada) {
      this.idadeInvalida = false;
      return;
    }

    // Calcula a idade
    let idade = hoje.getFullYear() - dataSelecionada.getFullYear();
    const mes = hoje.getMonth() - dataSelecionada.getMonth();
    const dia = hoje.getDate() - dataSelecionada.getDate();

    // Ajusta a idade caso o mês/dia do aniversário ainda não tenha chegado
    if (mes < 0 || (mes === 0 && dia < 0)) {
      idade--;
    }

    // Verifica se a idade é menor que 18 anos
    this.idadeInvalida = idade < 18;

    // Caso a idade seja inválida, limpa o campo
    if (this.idadeInvalida) {
      this.simpleForm.controls['data_nascimento'].setValue('');
    }
  }

  private buscarTipoEstruturaOrganica() {
    this.estruturaOrganicaServico
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.tipoEstruturaOrganicas = response.map((item: any) => ({
          id: item.id,
          text: item.name,
        }));
      });
  }

  private buscarTipoFuncao(): void {
    this.tipoFuncaoService
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.tipoFuncaos = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }

  // Dentro do seu componente...

public populate() {
    const fakeData = this.getFakeFormData();
    this.simpleForm.patchValue(fakeData); 
}


public getFakeFormData(): any {
  // -----------------------------------------------------------------
  // DADOS REAIS DE SIMULAÇÃO (Angola/Lusófono - respeitando as regex)
  // -----------------------------------------------------------------

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  const date30YearsAgo = new Date(today.setFullYear(today.getFullYear() - 30)).toISOString().split('T')[0];
  const date5YearsAgo = new Date(today.setFullYear(today.getFullYear() + 25)).toISOString().split('T')[0]; // Ajustando de volta para 5 anos atrás
  const dateIn5Years = new Date(today.setFullYear(today.getFullYear() + 35)).toISOString().split('T')[0]; // Data futura para expiração

  return {
    // ----------------------------------
    // DADOS DE IDENTIFICAÇÃO E REQUERIDOS
    // ----------------------------------
    nome_completo: 'Joaquim Silva Santos', // Mínimo 4, só letras e espaços (regexNome)
    data_nascimento: date30YearsAgo, // Data de 30 anos atrás (Requerido)
    genero: 1, // ID do Gênero (Ex: Masculino)
    estado_civil_id: 2, // ID do Estado Civil (Ex: Solteiro)
    naturalidade_id: 15, // ID da Naturalidade
    residencia_bi: 'Bairro Cassenda, Rua 123', // Endereço do BI
    nid: '001234567AO001', 
    niic: '789012', // 6 digitos (Opcional)
    data_emissao: date5YearsAgo, // Data de emissão (Requerido)
    data_expira: dateIn5Years, // Data futura (Opcional)
    nome_pai: 'António Joaquim', // (Opcional)
    nome_mae: 'Maria Santos', // (Opcional)
    local_nascimento: 'Luanda', // Mínimo 4 caracteres (Requerido)
    patente_id: 3, // ID da Patente (Requerido)
    sigpq_tipo_funcao_id: 7, // ID do Tipo de Função (Requerido)
    sigpq_tipo_categoria_id: 4, // ID da Categoria (Requerido)
    orgao_id: 101, // ID do Orgão (Requerido)
    tipo_orgao: 1, // Tipo de Orgão (Requerido)
    pessoajuridica_id: 101, // Geralmente o mesmo que orgao_id (Requerido)

    nip: '987654', // 6 digitos (Opcional)
    // Numero Agente: 8 digitos (Requerido)
    numero_agente: '11223344', 
    data_adesao: date5YearsAgo, // Data de adesão (Requerido)
    
    regime_id: 1, // ID do Regime (Requerido)
    sigpq_tipo_vinculo_id: 2, // ID do Tipo de Vínculo (Requerido)
    sigpq_situacao_id: 1, // ID da Situação Laboral (Requerido)
    sigpq_tipo_habilitacao_literaria_id: 6,
    sigpq_tipo_sanguineo_id: 3,
    contacto: '933445566', 
    contacto_alternativo: '88112233', 
    contacto_servico: '88998877',
    
    email: 'joaquim.santos@email.com', 
    iban: '000500000000000000021',
    nps: '01A23456B7-89',
    numero_despacho: '12342/SGP/2020',
    seccao:'Seccão X',
    brigada: 'Brigada Y',
    residencia_actual: 'Nova residência para correspondência',
    numero_carta_conducao: '1234567890',
    pseudonimo: 'Jota',
    linguas_internacionais: 'Inglês',
    linguas_nacionais: 'Kimbundo',
    numero_calcado: 42,
    numero_camisa: 'M',
    motivo_situacao_laboral: null,
    numero_calca: 44,
    email_institucional: 'jsantos@sic.gov.ao',
  };
}

  private criarForm() {
    const regexTelefone = /^9\d{8}$/;
    const regexTelefoneAlternativo = /^\d{8,15}$/;
    const regexNome = '^[A-Za-zÀ-ÖØ-öø-ÿ- ]*$';

    this.simpleForm = this.fb.group({
      foto_civil: [null, [Validators.required]],
      nome_completo: [
        null,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern(regexNome),
        ],
      ],
      data_nascimento: [null, [Validators.required]],

      genero: [null, [Validators.required]],
      estado_civil_id: [null, [Validators.required]],
      naturalidade_id: [null, [Validators.required]],
      municipio_id: [null],
      distrito_id: [null],
      residencia_bi: [null, [Validators.required]],

      nid: [
        null,
        [
          Validators.required,
          Validators.pattern('^[0-9]{9}[a-zA-Z]{2}[0-9]{3}$'),
        ],
      ],
      niic: [
        null,
        [
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(6),
          Validators.minLength(6),
        ],
      ],
      data_expira: [null],
      data_emissao: [null, Validators.required],
      nome_pai: [null, Validators.pattern(regexNome)],
      nome_mae: [null, Validators.pattern(regexNome)],
      local_nascimento: [null, [Validators.minLength(4), Validators.required]],

      numero_passaporte: [null],
      data_expira_passaporte: [null],
      patente_id: [null, [Validators.required]],

      sigpq_acto_progressao_id: [null],
      numero_despacho: [null],
      numero_ordem: [null],
      data_despacho: [null],
      data_ordem: [null],
      anexo: [null],

      data_despacho_nomeacao: [null],
      numero_despacho_nomeacao: [null],
      sigpq_acto_nomeacao_id: [null],
      sigpq_tipo_cargo_id: [null],
      sigpq_tipo_funcao_id: [null, Validators.required],
      anexo_nomeacao: [null],
      sigpq_tipo_categoria_id: [null, Validators.required],
      orgao_id: [null, [Validators.required]],
      tipo_orgao: [null, Validators.required],
      pessoajuridica_id: [null, [Validators.required]],

      departamento_id: [null],
      seccao_id: [null],
      brigada_id: [null],

      seccao: [null],

      brigada: [null],

      residencia_actual: [null],
      iban: [
        null,
        [
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(21),
          Validators.maxLength(21),
        ],
      ],
      numero_carta_conducao: [null],
      data_expira_carta_conducao: [null],

      sigpq_tipo_habilitacao_literaria_id: [null, [Validators.required]],
      sigpq_tipo_curso_id: [null],

      habilitacao_literaria_certificado: [null],

      sigpq_tipo_sanguineo_id: [null, Validators.required],
      contacto: [null, Validators.pattern(regexTelefone)],
      contacto_alternativo: [
        null,
        Validators.pattern(regexTelefoneAlternativo),
      ],
      contacto_servico: [null, Validators.pattern(regexTelefoneAlternativo)],
      email: [
        null,
        Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$'),
      ],

      foto_efectivo: [null],
      pseudonimo: [null],
      regime_id: [null, [Validators.required]],
      sigpq_tipo_vinculo_id: [null, [Validators.required]],
      // sigpq_vinculo_id: [null], // Will be conditionally required based on available options
      sigpq_estado_id: [null],
      // sigpq_estado_reforma_id: [null],
      sigpq_situacao_id: [null, [Validators.required]],
      nip: [
        null,
        [
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(6),
          Validators.minLength(6),
        ],
      ],

      numero_agente: [
        null,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(8),
          Validators.minLength(8),
        ],
      ],
      nps: [null, [Validators.pattern('^[0-9A-Z-]*$')]],
      data_adesao: [null, [Validators.required]],
      email_institucional: [null],

      linguas_internacionais: [null],
      linguas_nacionais: [null],
      numero_calcado: [null],
      numero_camisa: [null],
      motivo_situacao_laboral: [null],
      numero_calca: [null],
    });

    this.ajustarFotoFardado();

    // Adiciona listener para mudanças no campo orgao_id
    this.simpleForm.get('orgao_id')?.valueChanges.subscribe((value: any) => {
      console.log('orgao_id mudou para:', value);
      if (value && !isNaN(Number(value)) && Number(value) > 0) {
        this.simpleForm.patchValue({ pessoajuridica_id: Number(value) });
        console.log('pessoajuridica_id atualizado para:', Number(value));
      } else {
        this.simpleForm.patchValue({ pessoajuridica_id: null });
        console.log('pessoajuridica_id definido como null');
      }
    });
  }

  ajustarFotoFardado() {
    if (this.regimeQuadro == 'I') {
      this.simpleForm.get('foto_efectivo')?.setValidators(Validators.required);
      this.simpleForm.get('foto_efectivo')?.updateValueAndValidity();
    } else {
      this.simpleForm.get('foto_efectivo')?.setValidators(null);
      this.simpleForm.get('foto_efectivo')?.updateValueAndValidity();
    }
  }

  get f() {
    return this.simpleForm.controls;
  }

  get validaForm() {
    return this.simpleForm.controls;
  }

  public uploadFile(event: any, previsaoImageId: any = null): void {
    let file: File | Blob = event.target.files[0];
    const campo: any = event.target.dataset['foto'];

    this.setFoto(file, previsaoImageId, campo);
  }

  public setFoto(file: any, previsaoImageId: any, campo: any) {
    const element: any = previsaoImageId
      ? document.querySelector(`#${previsaoImageId}`)
      : null;
    this.simpleForm.get(campo)?.setValue(file);
    this.simpleForm.get(campo)?.updateValueAndValidity();
    if (element) {
      this.ficheiroService.convertFileToBinary(file, file.type).then((data) => {
        element.src = data;
      });
    }
  }

  private listarCursos() {
    const opcoes = {
      tipo: 'Formação Acadêmica',
    };

    this.cursoService
      .listarTodos(opcoes)
      .pipe(finalize(() => {}))
      .subscribe((response) => {
        this.cursos = response.map((item: any) => ({
          id: item.id,
          text: item.nome?.toUpperCase(),
        }));
      });
  }
  public uploadFilePDF(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0];
    this.simpleForm.get(campo)?.setValue(file);
    this.simpleForm.get(campo)?.updateValueAndValidity();
  }

  public listarProvincias() {
    this.provinciaService
      .listarTodos({})
      .pipe(finalize(() => {}))
      .subscribe((response: any) => {
        this.provincias = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }

  validarVinculo($event: any) {
    this.tituloVinculo = '';
    if (!$event) {
      this.simpleForm.get('sigpq_vinculo_id')?.disable();
      this.simpleForm.get('sigpq_vinculo_id')?.setValue(null);
      this.simpleForm.get('sigpq_vinculo_id')?.clearValidators();
      this.simpleForm.get('sigpq_vinculo_id')?.updateValueAndValidity();
      this.vinculos = []; // Clear the options
      return;
    }
    if (!this.getInfo) {
      this.simpleForm.get('sigpq_vinculo_id')?.enable();
    }

    const [vinculo] = this.tipoVinculos.filter(
      (item: any) => item?.id == $event
    );

    const opcoes = {
      sigpq_vinculo_id: $event,
    };

    this.tipoVinculoService
      .listar(opcoes)
      .pipe(
        finalize((): void => {
          if (this.vinculos.length) {
            this.tituloVinculo = vinculo?.text;
            // Only set as required if there are options available
            if (!this.getInfo) {
              this.simpleForm
                .get('sigpq_vinculo_id')
                ?.setValidators(Validators.required);
              this.simpleForm.get('sigpq_vinculo_id')?.updateValueAndValidity();
            }
          } else if (!this.getInfo) {
            this.simpleForm?.get('sigpq_vinculo_id')?.disable();
            this.simpleForm?.get('sigpq_vinculo_id')?.setValue(null);
            this.simpleForm?.get('sigpq_vinculo_id')?.clearValidators();
            this.simpleForm?.get('sigpq_vinculo_id')?.updateValueAndValidity();
          }
        })
      )
      .subscribe((response: any): void => {
        this.vinculos = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }

  validarCargo($event: any) {
    if ($event) {
      // this.simpleForm.get('sigpq_tipo_funcao_id')?.disable();
      // this.simpleForm.get('sigpq_tipo_funcao_id')?.clearValidators();
      // this.simpleForm.get('sigpq_tipo_funcao_id')?.updateValueAndValidity();
      // this.simpleForm.get('sigpq_tipo_funcao_id')?.setValue(null);
      if (!this.getInfo) {
        this.simpleForm.get('anexo_nomeacao')?.enable();
        // this.simpleForm.get('anexo_nomeacao').setValue(null)
        $('#anexo_nomeacao').prop('disabled', false);
        this.simpleForm.get('numero_despacho_nomeacao')?.enable();
        // this.simpleForm.get('numero_despacho_nomeacao').setValue(null)
        this.simpleForm.get('data_despacho_nomeacao')?.enable();
        // this.simpleForm.get('data_despacho_nomeacao').setValue(null)
      }

      this.simpleForm
        .get('numero_despacho_nomeacao')
        ?.setValidators(this.dataValidalitors);
      this.simpleForm
        .get('data_despacho_nomeacao')
        ?.setValidators(this.dataValidalitors);
      this.tipoFuncaos = [];
    } else if (!$event) {
      // this.simpleForm.get('sigpq_tipo_funcao_id').enable()
      // this.simpleFormvalidarVinculo.get('sigpq_tipo_funcao_id').setValue(null)
      // $('#anexo_nomeacao').prop('disabled', true);
      // // this.simpleForm.get('anexo_nomeacao')?.disable();
      // this.simpleForm.get('anexo_nomeacao')?.setValue(null);
      // // this.simpleForm.get('numero_despacho_nomeacao')?.disable();
      // this.simpleForm.get('numero_despacho_nomeacao')?.setValue(null);
      // // this.simpleForm.get('data_despacho_nomeacao')?.disable();
      // this.simpleForm.get('data_despacho_nomeacao')?.setValue(null);
      this.buscarTipoFuncao();
    }
  }

  public validarNomeacao($event: any) {
    if (!$event) {
      // this.simpleForm.get('sigpq_tipo_funcao_id').disable()
      // this.simpleForm.get('sigpq_tipo_funcao_id').setValue(null)
      this.simpleForm.get('sigpq_tipo_cargo_id')?.disable();
      this.simpleForm.get('sigpq_tipo_cargo_id')?.setValue(null);

      // this.simpleForm.get('anexo_nomeacao').disable()
      // this.simpleForm.get('anexo_nomeacao').setValue(null)
      // this.simpleForm.get('numero_despacho_nomeacao').disable()
      // this.simpleForm.get('numero_despacho_nomeacao').setValue(null)
      // this.simpleForm.get('data_despacho_nomeacao').disable()
      // this.simpleForm.get('data_despacho_nomeacao').setValue(null)
      this.tipoFuncaos = [];
      this.tipoCargos = [];
      this.validarCargo(null);
    } else if ($event) {
      // this.simpleForm.get('sigpq_tipo_funcao_id')?.disable();
      // this.simpleForm.get('sigpq_tipo_funcao_id')?.setValue(null);
      // if (!this.getInfo) this.simpleForm.get('sigpq_tipo_cargo_id')?.enable();
      // this.simpleForm.get('sigpq_tipo_cargo_id').setValue(null)
      this.simpleForm
        .get('sigpq_tipo_cargo_id')
        ?.setValidators(this.dataValidalitors);

      // this.simpleForm.get('anexo_nomeacao').enable()
      // this.simpleForm.get('anexo_nomeacao').setValue(null)
      // this.simpleForm.get('numero_despacho_nomeacao').enable()
      // this.simpleForm.get('numero_despacho_nomeacao').setValue(null)
      // this.simpleForm.get('data_despacho_nomeacao').enable()
      // this.simpleForm.get('data_despacho_nomeacao').setValue(null)
      this.buscarTipoFuncao();
      this.buscarTipoCargo();
      this.validarCargo(null);
    }
  }
  public handlerProvincias($event: any) {
    if (!$event) return;

    const opcoes = {
      provincia_id: $event,
    };

    this.municipioService
      .listar(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.municipios = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }

  private buscarCategorias(): void {
    this.tipoCarreiraOuCategoriaService
      .listar()
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.tipoCarreiraOuCategorias = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
        this.tipoCarreiraOuCategorias_ = response;
      });
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
        this.tipoCarreiraOuCategorias = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
        this.tipoCarreiraOuCategorias_ = response;
      });
  }

  private buscarTipoVinculo(options: any = null): void {
    if (!options) return;

    const opcoes = {
      regime: options.text,
    };
    this.tipoVinculoService
      .listar(opcoes)
      .pipe(
        finalize((): void => {
          if (options?.id == 1) {
            this.tipoVinculos = this.tipoVinculos.filter(
              (item: any) => item?.id == 1
            );
          }
        })
      )
      .subscribe((response: any): void => {
        this.tipoVinculos = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }

  private listarTipoSanguineo(): void {
    const opcoes = {};
    this.tipoSanguineo
      .listarTodos(opcoes)
      .pipe(finalize(() => {}))
      .subscribe((response) => {
        this.tipoSanguineos = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }

  private listarPais(): void {
    const opcoes = {};
    this.paisService
      .listarTodos(opcoes)
      .pipe(finalize(() => {}))
      .subscribe((response) => {
        this.paises = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }

  private buscarEstadoCivil(): void {
    const opcoes = {};
    this.estadoCivilService
      .listar(opcoes)
      .pipe(finalize(() => {}))
      .subscribe((response) => {
        this.estadoCivils = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }

  private buscarTipoHabilitacaoLiteraria(): void {
    const opcoes = {};
    this.tipoHabilitacaoLiterariaService
      .listar(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.tipoHabilitacaoLiterarias = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }

  selecionarOrgaoOuComandoProvincial($event: any): void {
    // this.simpleForm.get('tipo_orgao')?.disable();
    if (!$event) {
      // this.simpleForm.get('orgao_id')?.enable();
      this.simpleForm.get('orgao_id')?.setValue(null);
    } else {
      if (!this.getInfo) this.simpleForm.get('orgao_id')?.enable();
      this.simpleForm.get('orgao_id')?.setValue(null);
      const opcoes = {
        /* tipo_estrutura_sigla: $event  */
      };
      this.direcaoOuOrgaoService
        .listarTodos(opcoes)
        .pipe(finalize((): void => {}))
        .subscribe((response: any): void => {
          this.direcaoOuOrgao = response.map((item: any) => ({
            id: item.id,
            text: item.sigla + ' - ' + item.nome_completo,
          }));
          this._direcaoOuOrgao = response;
        });
    }
  }

  private dataValidalitors = [Validators.required];

  public buscarPatentes(idCategoria: any) {
    const classeSelecionada = this.tipoCarreiraOuCategorias_.filter(
      (x: any) => x.id == idCategoria
    )[0]?.nome;

    this.patenteService
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        response.sort((a: any, b: any) => a.id - b.id);
        this.patentes = response
          .filter((p: any) => p.classe == classeSelecionada)
          .map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
      });
  }

  private buscarRegime(): void {
    const opcoes = {};
    this.regimeService
      .listar(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.regimes = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
        this.regimes_ = response;
      });
  }

  public validarRegime($event: any): void {
    // if (!$event) {
    //   this.simpleForm.get('sigpq_tipo_vinculo_id')?.disable();
    //   this.simpleForm.get('sigpq_tipo_vinculo_id')?.setValue(null);
    //   this.validarVinculo(null);
    //   return;
    // }

    const [regime_] = this.regimes_.filter((item: any) => item.id == $event);
    this.regimeQuadro = regime_?.quadro;

    this.ajustarFotoFardado();

    /* console.log("Regime selecionado:",this.regimeQuadro=="I") */

    // if (!this.getInfo) {
    //   this.simpleForm.get('sigpq_tipo_vinculo_id')?.enable();
    //   this.simpleForm.get('sigpq_tipo_vinculo_id')?.setValue(null);
    //   this.simpleForm
    //     .get('sigpq_tipo_vinculo_id')
    //     ?.setValidators(this.dataValidalitors);
    // }
    if ($event == 1) {
      this.validarClasse($event, true, true);
      //this.patentes = this.patentes.filter((p) => Number(p.id) < 17)
      //this.simpleForm.get('sigpq_tipo_categoria_id')?.disable();
    } else {
      //this.simpleForm.get('sigpq_tipo_categoria_id')?.disable();
      this.validarClasse($event, true);
    }

    if (this.getId && this.edit) {
      if ($event == 1) {
        this.regimeTipo = true;
        this.simpleForm.get('nip')?.enable();
        // this.simpleForm.get('data_despacho')?.disable();
        // this.simpleForm.get('numero_despacho')?.disable();
        this.simpleForm.get('numero_ordem')?.enable();
        this.simpleForm.get('data_ordem')?.enable();
        this.simpleForm.get('sigpq_acto_progressao_id')?.enable();
        this.simpleForm.get('sigpq_tipo_cargo_id')?.enable();
        this.simpleForm.get('anexo')?.enable();
        this.simpleForm.get('patente_id')?.enable();
        if (this.simpleForm.get('patente_id')?.value < 7) {
          // this.simpleForm.get('sigpq_tipo_cargo_id')?.disable();
          // this.simpleForm.get('sigpq_tipo_cargo_id')?.setValue(null);
        } else {
          // this.simpleForm.get('sigpq_tipo_cargo_id')?.enable();
        }

        // this.simpleForm.get('patente_id')?.setValue(this.selectedPatente);
      } else {
        // this.regimeTipo = false;
        // this.simpleForm.get('nip')?.disable();
        // this.simpleForm.get('data_ordem')?.disable();
        // this.simpleForm.get('numero_ordem')?.disable();
        // this.simpleForm.get('numero_despacho')?.enable();
        // this.simpleForm.get('data_despacho')?.enable();
        // this.simpleForm.get('sigpq_acto_progressao_id')?.disable();
        // this.simpleForm.get('anexo')?.disable();
        /* this.simpleForm.get('patente_id').setValue(17)
        this.simpleForm.get('patente_id').disable() */
      }
      this.edit = false;
      return;
    }
    if (!this.getInfo) {
      if ($event == 1) {
        this.regimeTipo = true;
        // this.simpleForm.get('nip')?.enable();
        // this.simpleForm.get('data_ordem')?.enable();
        // this.simpleForm.get('data_ordem')?.setValue(null);
        // // this.simpleForm.get('data_despacho')?.disable();
        // // this.simpleForm.get('numero_despacho')?.disable();
        // this.simpleForm.get('data_despacho')?.setValue(null);
        // this.simpleForm.get('numero_despacho')?.setValue(null);
        // this.simpleForm.get('numero_ordem')?.enable();
        // this.simpleForm.get('numero_ordem')?.setValue(null);
        // this.simpleForm.get('anexo')?.enable();
        // this.simpleForm.get('sigpq_acto_progressao_id')?.setValue(null);
        // this.simpleForm.get('sigpq_acto_progressao_id')?.enable();
        // this.simpleForm.get('patente_id')?.setValue(null);
        // this.simpleForm.get('patente_id')?.enable();

        this.simpleForm.get('nip')?.setValidators(this.dataValidalitors);
        this.simpleForm.get('data_ordem')?.setValidators(this.dataValidalitors);
        this.simpleForm
          .get('numero_ordem')
          ?.setValidators(this.dataValidalitors);
        // this.simpleForm.get('anexo')?.setValidators(this.dataValidalitors)
        this.simpleForm
          .get('sigpq_acto_progressao_id')
          ?.setValidators(this.dataValidalitors);
        this.simpleForm.get('patente_id')?.setValidators(this.dataValidalitors);

        // if (this.simpleForm.get('patente_id').value < 7) {
        //   this.simpleForm.get('sigpq_tipo_cargo_id').disable()
        //   this.simpleForm.get('sigpq_tipo_cargo_id').setValue(null)
        // } else {
        //   this.simpleForm.get('sigpq_tipo_cargo_id').enable()
        // }

        this.simpleForm.get('patente_id')?.setValue(this.selectedPatente);
      } else {
        this.regimeTipo = false;

        // this.simpleForm.get('nip')?.setValue(null);
        // this.simpleForm.get('numero_despacho')?.setValue(null);
        // this.simpleForm.get('numero_ordem')?.setValue(null);
        // this.simpleForm.get('anexo')?.setValue(null);
        // this.simpleForm.get('sigpq_acto_progressao_id')?.setValue(null);
        // this.simpleForm.get('sigpq_acto_progressao_id')?.disable();

        // this.simpleForm
        //   .get('numero_despacho')
        //   ?.setValidators(this.dataValidalitors);
        // this.simpleForm
        //   .get('data_despacho')
        //   ?.setValidators(this.dataValidalitors);

        // this.simpleForm.get('data_ordem')?.disable();
        // // this.simpleForm.get('data_despacho').disable()
        // this.simpleForm.get('data_ordem')?.setValue(null);
        // this.simpleForm.get('data_despacho')?.setValue(null);

        // this.simpleForm.get('nip')?.disable();
        // // this.simpleForm.get('numero_despacho').disable()
        // this.simpleForm.get('numero_ordem')?.disable();
        // this.simpleForm.get('numero_despacho')?.enable();
        // this.simpleForm.get('data_despacho')?.enable();
        // this.simpleForm.get('anexo')?.disable();

        /*  this.simpleForm.get('patente_id').setValue(17)
         this.simpleForm.get('patente_id').disable() */
        // this.simpleForm.get('sigpq_acto_progressao_id')?.disable();
      }
    }

    this.buscarTipoCarreiraOuCategoria($event);

    const regimes = this.regimes.filter((regime) => regime.id == $event);
    const [regime] = regimes;
    this.buscarTipoVinculo(regime);
  }
  public handlerCollapse($evt: any) {
    const collapse: any = document.querySelector(`#${$evt}`);
    const faInput: any = collapse.querySelector('.fa-1');

    if (faInput) {
      faInput.classList.toggle('fa-plus');
      faInput.classList.toggle('fa-minus');
    }
  }

  validaDataAdesao(): boolean {
    const data = this.simpleForm.controls['data_adesao']?.value;
    if (!data) return false;
    const format = this.formatarDataHelper.detectDateFormat(data);
    if (format == 'unknown') return false;
    return this.formatarDataHelper.validaDataAdesao(data, format);
  }
  validarData($event: any) {
    if (this.getId || this.getInfo) return;
    this.validaDataAdesao();
  }
  validarDataMinus() {
    const data = this.simpleForm.controls['data_nascimento']?.value;
    if (!data) {
      // this.simpleForm.get('data_adesao')?.disable();
      // this.simpleForm.get('data_adesao')?.setValue(null);
      return;
    }
    if (!this.getInfo) this.simpleForm.get('data_adesao')?.enable();
    // this.simpleForm.get('data_adesao')?.setValue(null)

    const format = this.formatarDataHelper.detectDateFormat(data);
    if (format == 'unknown') return false;

    const d = this.formatarDataHelper.validarMinusAdesao(data);

    return d;
  }

  // public validarFuncao($event: any) {
  //   if (!$event) return
  //   const [funcao] = this.tipoFuncaos.filter((item: any) => item?.id == $event) as any

  //   console.log(funcao)
  //   // data_despacho_nomeacao: [null],
  //   // numero_despacho_nomeacao
  //   if (['especialista'].includes(funcao?.text?.toString().toLowerCase())) {
  //     this.simpleForm.get('numero_despacho_nomeacao')?.disable()
  //     this.simpleForm.get('data_despacho_nomeacao')?.disable()
  //     this.simpleForm.get('ordem_numero_nomeacao')?.setValue(null)
  //     this.simpleForm.get('data_despacho_nomeacao')?.setValue(null)
  //   } else {
  //     this.simpleForm.get('ordem_numero_nomeacao')?.enable()
  //     this.simpleForm.get('data_despacho_nomeacao')?.enable()
  //     this.simpleForm.get('ordem_numero_nomeacao')?.setValue(null)
  //     this.simpleForm.get('data_despacho_nomeacao')?.setValue(null)
  //   }
  // }

  public setarCarreiraOrCategoria(idPatente: any) {
    if (idPatente) {
      const patente = this.patentes_.find((p: any) => p.id == idPatente);
      if (patente) {
        const carreira = this.tipoCarreiraOuCategorias.find(
          (item) => item.id == patente.sigpq_tipo_carreira_id
        );
        this.simpleForm.get('sigpq_tipo_categoria_id')?.setValue(carreira?.id);
      }
    }
  }

  public validarClasse(
    evt: any = null,
    geral: boolean = false,
    incluirSomenteEfetivoQuadroUm: boolean = false
  ) {
    if (!evt && !geral) return;

    geral = evt >= 1 && evt <= 6 ? true : false;

    console.log('REGIME SLECIONADO:', evt);
    const options = {
      regime_id: evt,
    };

    this.patenteService
      .listar(options)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        response.sort((a: any, b: any) => a.id - b.id);
        if (evt == 2)
          this.patentes = response
            .filter((item: any) => item.sigpq_tipo_carreira_id < 7)
            .map((item: any) => ({ id: item.id, text: item.nome }));
        else
          this.patentes = response
            .filter(
              (item: any) =>
                item.sigpq_tipo_carreira_id > 6 &&
                item.sigpq_tipo_carreira_id < 12
            ) // Filtra os itens com id menor que 17
            .map((item: any) => ({ id: item.id, text: item.nome })); // Mapeia os itens filtrados
        this.patentes_ = response;
        console.log('Patentes:', response);
      });
  }

  // onSubmit() {
  //   console.log('Início do onSubmit');

  //   // Validação básica do formulário
  //   if (!this.simpleForm) {
  //     alert('Formulário não inicializado!');
  //     return;
  //   }

  //   if (this.simpleForm.invalid || this.submitted) {
  //     console.log('Formulário inválido ou já submetido');
  //     console.log('Formulário válido:', this.simpleForm.valid);
  //     console.log('Formulário submetido:', this.submitted);
  //     this.utilService.validarCampo(this.simpleForm);
  //     return;
  //   }

  //   // Garante que pessoajuridica_id receba o valor correto de orgao_id
  //   const orgaoId = this.simpleForm.value.orgao_id;
  //   console.log('orgao_id:', orgaoId);
  //   if (orgaoId && !isNaN(Number(orgaoId)) && Number(orgaoId) > 0) {
  //     this.simpleForm.patchValue({ pessoajuridica_id: Number(orgaoId) });
  //     console.log('pessoajuridica_id definido como:', Number(orgaoId));
  //   } else {
  //     this.simpleForm.patchValue({ pessoajuridica_id: null });
  //     console.log('pessoajuridica_id definido como null - orgao_id inválido');
  //   }

  //   const formValue = this.simpleForm.getRawValue();
  //   console.log('Valores do formulário:', formValue);
  //   console.log('pessoajuridica_id:', formValue.pessoajuridica_id);

  //   // Validação extra para pessoajuridica_id
  //   if (
  //     formValue.pessoajuridica_id === null ||
  //     formValue.pessoajuridica_id === undefined ||
  //     isNaN(Number(formValue.pessoajuridica_id)) ||
  //     Number(formValue.pessoajuridica_id) <= 0
  //   ) {
  //     console.error('pessoajuridica_id inválido:', formValue.pessoajuridica_id);
  //     alert(
  //       'Erro: Selecione uma Direção/Órgão válido! O campo pessoajuridica_id está inválido.'
  //     );
  //     return;
  //   }

  //   // Campos obrigatórios essenciais (sempre obrigatórios)
  //   const camposObrigatorios = [
  //     'nome_completo',
  //     'data_nascimento',
  //     'genero',
  //     'estado_civil_id',
  //     'nid',
  //     'data_adesao',
  //     'regime_id',
  //     'sigpq_tipo_vinculo_id',
  //     'sigpq_situacao_id',
  //     'numero_agente',
  //     'orgao_id',
  //     'patente_id',
  //     'sigpq_tipo_categoria_id',
  //   ];

  //   // Validação de campos obrigatórios
  //   for (const campo of camposObrigatorios) {
  //     const control = this.simpleForm.get(campo);
  //     if (
  //       !control ||
  //       control.value === undefined ||
  //       control.value === null ||
  //       control.value === ''
  //     ) {
  //       console.error(`Campo obrigatório não preenchido: ${campo}`);
  //       console.error(`Valor do campo:`, control?.value);
  //       alert(`O campo ${campo} é obrigatório!`);
  //       return;
  //     }
  //   }

  //   // Validação condicional para sigpq_vinculo_id
  //   const sigpqTipoVinculoId = this.simpleForm.get(
  //     'sigpq_tipo_vinculo_id'
  //   )?.value;
  //   const sigpqVinculoId = this.simpleForm.get('sigpq_vinculo_id')?.value;
  //   if (
  //     sigpqTipoVinculoId &&
  //     this.vinculos.length > 0 &&
  //     (!sigpqVinculoId || sigpqVinculoId === '')
  //   ) {
  //     console.error(
  //       'Campo sigpq_vinculo_id é obrigatório quando há opções disponíveis'
  //     );
  //     alert('O campo sigpq_vinculo_id é obrigatório!');
  //     return;
  //   }

  //   // Validação condicional para sigpq_tipo_cargo_id e sigpq_tipo_funcao_id
  //   const sigpqActoNomeacaoId = this.simpleForm.get(
  //     'sigpq_acto_nomeacao_id'
  //   )?.value;
  //   const sigpqTipoCargoId = this.simpleForm.get('sigpq_tipo_cargo_id')?.value;
  //   const sigpqTipoFuncaoId = this.simpleForm.get(
  //     'sigpq_tipo_funcao_id'
  //   )?.value;

  //   if (sigpqActoNomeacaoId) {
  //     // Se tem ato de nomeação, cargo é obrigatório
  //     if (!sigpqTipoCargoId || sigpqTipoCargoId === '') {
  //       console.error(
  //         'Campo sigpq_tipo_cargo_id é obrigatório quando há ato de nomeação'
  //       );
  //       alert('O campo Cargo é obrigatório!');
  //       return;
  //     }
  //   } else {
  //     // Se não tem ato de nomeação, função é obrigatória
  //     if (!sigpqTipoFuncaoId || sigpqTipoFuncaoId === '') {
  //       console.error(
  //         'Campo sigpq_tipo_funcao_id é obrigatório quando não há ato de nomeação'
  //       );
  //       alert('O campo Função é obrigatório!');
  //       return;
  //     }
  //   }

  //   this.submitted = true;
  //   this.isLoading = true;
  //   console.log('Enviando dados para o backend...');

  //   // Determina se é edição ou registro
  //   const isEditing = !!this.getId;
  //   console.log('Modo:', isEditing ? 'Edição' : 'Registro');
  //   console.log('ID:', this.getId);

  //   // Envia os dados diretamente sem teste de conexão
  //   const type = isEditing
  //     ? this.funcionarioServico.editar(this.getId, this.simpleForm)
  //     : this.funcionarioServico.registar(formValue);

  //   type
  //     .pipe(
  //       takeUntil(this.destroy$),
  //       finalize(() => {
  //         this.isLoading = false;
  //         this.submitted = false;
  //         console.log('Finalizou o carregamento');
  //       })
  //     )
  //     .subscribe({
  //       next: (response: any) => {
  //         console.log('Resposta do backend:', response);
  //         console.log('Tipo da resposta:', typeof response);
  //         console.log('Estrutura da resposta:', Object.keys(response || {}));

  //         if (!response) {
  //           console.error('Resposta vazia do backend');
  //           alert(
  //             'Nenhuma resposta do backend. Verifique se todos os campos obrigatórios estão preenchidos.'
  //           );
  //           return;
  //         }

  //         // Sucesso na operação
  //         if (isEditing) {
  //           console.log('Edição realizada com sucesso');
  //           alert('Dados atualizados com sucesso!');
  //           // Pode redirecionar ou atualizar a página conforme necessário
  //         } else {
  //           console.log('Registro realizado com sucesso');
  //           console.log('pessoaId:', response.pessoaId);
  //           alert('Funcionário registado com sucesso!');
  //           this.restaurarFormulario();
  //           setTimeout(() => {
  //             this.router.navigate([
  //               '/piips/sigpg/funcionario/registar-ou-editar/mais-informacao',
  //               response.pessoaId,
  //             ]);
  //           }, 300);
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Erro ao salvar:', err);
  //         console.error('Status do erro:', err.status);
  //         console.error('Status text:', err.statusText);
  //         console.error('URL da requisição:', err.url);
  //         console.error('Detalhes do erro:', JSON.stringify(err));

  //         // Tratamento de erro mais específico
  //         let errorMessage = 'Erro ao salvar os dados!';

  //         if (err.error && err.error.message) {
  //           errorMessage = err.error.message;
  //         } else if (
  //           err.error &&
  //           err.error.object &&
  //           err.error.object.message
  //         ) {
  //           errorMessage = err.error.object.message;
  //         } else if (err.message) {
  //           errorMessage = err.message;
  //         } else if (err.status === 422) {
  //           errorMessage =
  //             'Dados inválidos. Verifique se todos os campos obrigatórios estão preenchidos corretamente.';
  //         } else if (err.status === 500) {
  //           errorMessage =
  //             'Erro interno do servidor. Tente novamente mais tarde.';
  //         } else if (err.status === 401) {
  //           errorMessage = 'Sessão expirada. Faça login novamente.';
  //         } else if (err.status === 403) {
  //           errorMessage = 'Sem permissão para realizar esta operação.';
  //         }

  //         console.error('Mensagem de erro final:', errorMessage);
  //         alert(errorMessage);
  //       },
  //       complete: () => {
  //         console.log('Subscribe complete');
  //       },
  //     });

  //   console.log('Fim do onSubmit');
  // }

  onSubmit() {
    console.log('Início do onSubmit nd');
    // Validação básica do formulário
    if (!this.simpleForm) {
      alert('Formulário não inicializado!');
      return;
    }
    if (this.simpleForm.invalid || this.submitted) {
      console.log('Formulário inválido ou já submetido');
      console.log('Formulário válido:', this.simpleForm.valid);
      console.log('Formulário submetido:', this.submitted);
      this.utilService.validarCampo(this.simpleForm);

      Object.keys(this.simpleForm.controls).forEach(key => {
        const control = this.simpleForm.controls[key];
        
        // Check if the individual control is invalid
        if (control.invalid) {
          console.error(`Control: ${key}`);
          console.error(`Errors:`, control.errors); // Log the validation errors object
          console.error(`Value: ${control.value}`);
          console.error(`Status: ${control.status}`);
        }
      });

      
      return;
    }
    // Garante que pessoajuridica_id receba o valor correto de orgao_id
    const orgaoId = this.simpleForm.value.orgao_id;
    console.log('orgao_id:', orgaoId);
    if (orgaoId && !isNaN(Number(orgaoId)) && Number(orgaoId) > 0) {
      this.simpleForm.patchValue({ pessoajuridica_id: Number(orgaoId) });
      console.log('pessoajuridica_id definido como:', Number(orgaoId));
    } else {
      this.simpleForm.patchValue({ pessoajuridica_id: null });
      console.log('pessoajuridica_id definido como null - orgao_id inválido');
    }
    const formValue = this.simpleForm.getRawValue();

    console.log('Valores do formulário:', formValue);
    console.log('pessoajuridica_id:', formValue.pessoajuridica_id);
    // Validação extra para pessoajuridica_id
    if (
      formValue.pessoajuridica_id === null ||
      formValue.pessoajuridica_id === undefined ||
      isNaN(Number(formValue.pessoajuridica_id)) ||
      Number(formValue.pessoajuridica_id) <= 0
    ) {
      console.error('pessoajuridica_id inválido:', formValue.pessoajuridica_id);
      alert(
        'Erro: Selecione uma Direção/Órgão válido! O campo pessoajuridica_id está inválido.'
      );
      return;
    }
    // Campos obrigatórios essenciais (sempre obrigatórios)
    let camposObrigatorios = [
      'nome_completo',
      'data_nascimento',
      'genero',
      'estado_civil_id',
      'nid',
      'data_adesao',
      'regime_id',
      'sigpq_tipo_vinculo_id',
      'sigpq_situacao_id',
      'numero_agente',
      'orgao_id',
      'patente_id',
      'sigpq_tipo_categoria_id',
    ];

    if (this.regimeQuadro == 'II') {

    }
    // Validação de campos obrigatórios
    for (const campo of camposObrigatorios) {
      const control = this.simpleForm.get(campo);
      if (
        !control ||
        control.value === undefined ||
        control.value === null ||
        control.value === ''
      ) {
        console.error(`Campo obrigatório não preenchido: ${campo}`);
        console.error(`Valor do campo:`, control?.value);
        alert(`O campo ${campo} é obrigatório!`);
        return;
      }
    }
    // Validação condicional para sigpq_vinculo_id
    const sigpqTipoVinculoId = this.simpleForm.get(
      'sigpq_tipo_vinculo_id'
    )?.value;
    const sigpqVinculoId = this.simpleForm.get('sigpq_vinculo_id')?.value;
    if (
      sigpqTipoVinculoId &&
      this.vinculos.length > 0 &&
      (!sigpqVinculoId || sigpqVinculoId === '')
    ) {
      console.error(
        'Campo sigpq_vinculo_id é obrigatório quando há opções disponíveis'
      );
      alert('O campo sigpq_vinculo_id é obrigatório!');
      return;
    }
    // Validação condicional para sigpq_tipo_cargo_id e sigpq_tipo_funcao_id
    const sigpqActoNomeacaoId = this.simpleForm.get(
      'sigpq_acto_nomeacao_id'
    )?.value;
    const sigpqTipoCargoId = this.simpleForm.get('sigpq_tipo_cargo_id')?.value;
    const sigpqTipoFuncaoId = this.simpleForm.get(
      'sigpq_tipo_funcao_id'
    )?.value;
    if (sigpqActoNomeacaoId) {
      // Se tem ato de nomeação, cargo é obrigatório
      if (!sigpqTipoCargoId || sigpqTipoCargoId === '') {
        console.error(
          'Campo sigpq_tipo_cargo_id é obrigatório quando há ato de nomeação'
        );
        alert('O campo Cargo é obrigatório!');
        return;
      }
    } else {
      // Se não tem ato de nomeação, função é obrigatória
      if (!sigpqTipoFuncaoId || sigpqTipoFuncaoId === '') {
        console.error(
          'Campo sigpq_tipo_funcao_id é obrigatório quando não há ato de nomeação'
        );
        alert('O campo Função é obrigatório!');
        return;
      }
    }
    this.submitted = true;
    this.isLoading = true;
    console.log('Enviando dados para o backend...');
    // Determina se é edição ou registro
    const isEditing = !!this.getId;
    console.log('Modo:', isEditing ? 'Edição' : 'Registro');
    console.log('ID:', this.getId);
    // Envia os dados diretamente sem teste de conexão
    try {
      const type = isEditing
      ? this.funcionarioServico.editar(this.getId, this.simpleForm)
      : this.funcionarioServico.registar(formValue);

    type
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.submitted = false;
          console.log('Finalizou o carregamento');
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('Resposta do backend:', response);
          console.log('Tipo da resposta:', typeof response);
          console.log('Estrutura da resposta:', Object.keys(response || {}));
          // if (!response) {
          //   console.error('Resposta vazia do backend');
          //   // alert(
          //   //   'Nenhuma resposta do backend. Verifique se todos os campos obrigatórios estão preenchidos.'
          //   // );
          //   return;
          // }
          // Sucesso na operação
          if (isEditing) {
            console.log('Edição realizada com sucesso');

            setTimeout(() => {
              this.router.navigate([
                '/piips/sigpg/funcionario/registar-ou-editar/mais-informacao',
                this.getPessoaId,
              ]);
            }, 300);
            // Pode redirecionar ou atualizar a página conforme necessário
          } else {
            console.log('Registro realizado com sucesso');
            console.log('pessoaId:', response.pessoaId);
            alert('Funcionário registado com sucesso!');
            this.restaurarFormulario();
            setTimeout(() => {
              this.router.navigate([
                '/piips/sigpg/funcionario/registar-ou-editar/mais-informacao',
                this.getPessoaId,
              ]);
            }, 300);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.submitted = false;
          console.error('Erro ao salvar:', err);
          console.error('Status do erro:', err.status);
          console.error('Status text:', err.statusText);
          console.error('URL da requisição:', err.url);
          console.error('Detalhes do erro:', JSON.stringify(err));
          // Tratamento de erro mais específico
          let errorMessage = 'Erro ao salvar os dados!';
          if (err.error && err.error.message) {
            errorMessage = err.error.message;
          } else if (
            err.error &&
            err.error.object &&
            err.error.object.message
          ) {
            errorMessage = err.error.object.message;
          } else if (err.message) {
            errorMessage = err.message;
          } else if (err.status === 422) {
            errorMessage =
              'Dados inválidos. Verifique se todos os campos obrigatórios estão preenchidos corretamente.';
          } else if (err.status === 500) {
            errorMessage =
              'Erro interno do servidor. Tente novamente mais tarde.';
          } else if (err.status === 401) {
            errorMessage = 'Sessão expirada. Faça login novamente.';
          } else if (err.status === 403) {
            errorMessage = 'Sem permissão para realizar esta operação.';
          }
          console.error('Mensagem de erro final:', errorMessage);
          alert(errorMessage);
        },
        complete: () => {
          console.log('Subscribe complete');
        },
      });
    } catch (error) {
      console.log(error)
    }
    console.log('Fim do onSubmit');

    // alert('Chamou');

    // return new Promise((resolve, reject) => {
    //   this.employeeService
    //     .save({})
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe({
    //       next: (response) => {
    //         console.log('Teste de conexão bem-sucedido:', response);
    //         resolve('');
    //       },
    //       error: (err) => {
    //         console.error('Erro no teste de conexão:', err);
    //         reject(err);
    //       },
    //     });
    // });
  }

  // Método para testar conexão com o backend
  private async testarConexao(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Testando conexão com o backend...');
      // Teste simples de conexão - verificar se o serviço está funcionando
      this.funcionarioServico
        .listar({ page: 1, perPage: 1 })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log('Teste de conexão bem-sucedido:', response);
            resolve();
          },
          error: (err) => {
            console.error('Erro no teste de conexão:', err);
            reject(err);
          },
        });
    });
  }

  // Método para testar o salvamento com dados mínimos
  public testarSalvamento(): void {
    console.log('Iniciando teste de salvamento...');

    const dadosTeste = {
      nome_completo: 'Teste Nome',
      apelido: 'Teste Apelido',
      data_nascimento: '1990-01-01',
      genero: 'M',
      estado_civil_id: 1,
      nid: '123456789',
      data_adesao: '2020-01-01',
      regime_id: 1,
      sigpq_tipo_vinculo_id: 1,
      sigpq_vinculo_id: 1,
      sigpq_estado_id: 1,
      sigpq_situacao_id: 1,
      departamento_id: 1,
      seccao_id: 1,
      posto_id: 1,
      nip: '123456',
      numero_agente: 123456,
      orgao_id: 1,
      pessoajuridica_id: 1,
      patente_id: 1,
      sigpq_tipo_cargo_id: 1,
      sigpq_tipo_funcao_id: '1',
      sigpq_tipo_categoria_id: '1',
    };

    console.log('Dados de teste:', dadosTeste);

    this.funcionarioServico
      .registar(dadosTeste)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Teste de salvamento bem-sucedido:', response);
          alert('Teste de salvamento bem-sucedido!');
        },
        error: (err) => {
          console.error('Erro no teste de salvamento:', err);
          alert(
            'Erro no teste de salvamento: ' +
              (err.message || 'Erro desconhecido')
          );
        },
      });
  }

  public selecionarOrgaoComBaseNoDepartamento(departamento: number) {
    if (departamento) {
      const orgao = this._direcaoOuOrgao.find((p: any) => p.id == departamento);
      if (orgao) {
        const carreira = this.tipoEstruturaOrganicas.find(
          (item: any) => item.id === orgao.tipo_estrutura_organica_sigla
        );
        if (carreira) this.simpleForm.get('tipo_orgao')?.setValue(carreira?.id);
        else this.simpleForm.get('tipo_orgao')?.enable();
      }
    }
  }
  public validarDirecao($event: any) {
    if (!$event) {
      this.simpleForm.get('departamento_id')?.disable();
      this.simpleForm.get('departamento_id')?.setValue(null);
    } else if ($event && this.agenteFora) {
      this.simpleForm.get('departamento_id')?.disable();
      this.simpleForm.get('departamento_id')?.setValue(null);
      this.selecionarDepartamento(null);
    } else {
      if (!this.getInfo) this.simpleForm.get('departamento_id')?.enable();
      // this.simpleForm.get('departamento_id')?.setValue(null)
      const opcoes = {
        pessoajuridica_id: Number($event),
      };
      this.departamentoService
        .listarTodos(opcoes)
        .pipe(finalize((): void => {}))
        .subscribe({
          next: (response: any) => {
            this.departamentos = response.map((item: any) => ({
              id: item.id,
              text: item.sigla + ' - ' + item.nome_completo,
            }));
          },
        });
    }
    this.selecionarOrgaoComBaseNoDepartamento($event);
  }
  public buscarUnidade($event: any) {
    if (!$event) return;
    const opcoes = {
      pessoajuridica_id: $event,
      entidade: 'Unidade',
    };
    this.departamentoService
      .listarTodos(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (response: any) => {
          this.unidades = response.map((item: any) => ({
            id: item.id,
            text: item.sigla + ' - ' + item.nome_completo,
          }));
        },
      });
  }
  // public selecionarDirecao($event: any) {
  //   // this.buscarUnidade($event)
  //   console.log($event)
  //   this.buscarDepartamento($event)
  // }

  public buscarDepartamento($event: any) {
    const opcoes = {
      pessoajuridica_id: $event,
    };
    this.departamentoService
      .listarTodos(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (response: any) => {
          this.departamentos = response.map((item: any) => ({
            id: item.id,
            text: item.sigla + ' - ' + item.nome_completo,
          }));
        },
      });
  }

  public selecionarDepartamento($event: any) {
    this.buscarSeccao($event);
    // const opcoes = {
    //   departamentoId: $event
    // }
    // this.seccaoService.listarTodos(opcoes).pipe(
    //   finalize((): void => {

    //   })
    // ).subscribe({
    //   next: (response: any) => {
    //     this.seccoes = response.map((item: any) => ({ id: item.id, text: item.sigla + " - " + item.nome_completo }))
    //   }
    // })
  }

  public selecionarSeccao($event: any) {
    this.buscarSeccao($event);
    // const opcoes = {
    //   departamentoId: $event
    // }
    // this.seccaoService.listarTodos(opcoes).pipe(
    //   finalize((): void => {

    //   })
    // ).subscribe({
    //   next: (response: any) => {
    //     this.seccoes = response.map((item: any) => ({ id: item.id, text: item.sigla + " - " + item.nome_completo }))
    //   }
    // })
  }

  public buscarSeccao($event: any) {
    this.seccoes = [];
    if (!$event) {
      this.simpleForm.get('seccao_id')?.disable();
      this.simpleForm.get('seccao_id')?.setValue(null);
    } else if ($event && this.agenteFora) {
      this.simpleForm.get('seccao_id')?.disable();
      this.simpleForm.get('seccao_id')?.setValue(null);
    } else {
      if (!this.getInfo) this.simpleForm.get('seccao_id')?.enable();
      // this.simpleForm.get('seccao_id')?.setValue(null)

      const opcoes = {
        departamentoId: $event,
      };
      this.seccaoService
        .listarTodos(opcoes)
        .pipe(finalize((): void => {}))
        .subscribe({
          next: (response: any) => {
            this.seccoes = response.map((item: any) => ({
              id: item.id,
              text: item.sigla + ' - ' + item.nome_completo,
            }));
          },
        });
    }
  }

  restaurarFormulario() {
    this.simpleForm.reset();
  }

  buscarBrigada($e: any) {
    if (!$e) return;
    const options = { seccaoId: $e };

    this.unidadeService
      .listarTodos(options)
      .pipe(finalize(() => {}))
      .subscribe((response) => {
        this.brigadas = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome_completo,
        }));
      });
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

  proximo(id: any) {
    const btnNext: any = document.querySelector(`#${id}`);
    if (!btnNext) return;

    this.tabCount = this.tabCount + 1;
    btnNext.click();
  }

  toogle() {
    if (this.tabCount == 0) this.tabCount = 2;
    else this.tabCount = 0;
  }

  anterior(id: any) {
    const btnNext: any = document.querySelector(`#${id}`);

    if (!btnNext) return;

    this.tabCount = this.tabCount - 1;
    btnNext.click();
  }

  alterarPasso(posicao: number) {
    this.tabCount = posicao;
  }

  public cancelar() {
    if (!this.params.getId && !this.params.getInfo) {
      this.restaurarFormulario();
    }
    this.anterior('tab-dado-pessoais');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onCameraCivil() {
    this.abrirCameraCivil = true;
    this.abrirCamera = true;
  }
  public onCameraEfectivo() {
    this.abrirCameraEfectivo = true;
    this.abrirCamera = true;
  }

  public onFecharCamera($event: any) {
    if ($event.file != null) {
      if (this.abrirCameraCivil || this.abrirCameraEfectivo) {
        if (this.abrirCameraCivil) {
          this.setFoto($event.file, 'foto-civil', 'foto_civil');
        } else if (this.abrirCameraEfectivo) {
          this.setFoto($event.file, 'foto-efectivo', 'foto_efectivo');
        }
      }
    }

    this.abrirCamera = false;
    this.abrirCameraCivil = false;
    this.abrirCameraEfectivo = false;
  }

  public get getInfo(): number {
    return this.params?.getInfo as number;
  }

  public get getId(): number {
    return this.params?.getId as number;
  }

  public handlerRegime($event: any) {
    const regimes = this.regimes.filter((regime) => regime.id == $event);
    const [regime] = regimes;
    this.buscarTipoVinculo(regime);
  }

  public selecionarMunicipio($event: any) {
    if (!$event) return;
    this.distritoService
      .listarTodos({ municipio_id: $event })
      .pipe()
      .subscribe({
        next: (respponse: any) => {
          this.distritos = respponse.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }

  public selecionarSituacaoLaboralLaboral($event: any) {
    this.tituloSituacaoLaboral = '';

    if (!$event) {
      this.simpleForm.get('sigpq_estado_reforma_id')?.disable();
      this.simpleForm.get('sigpq_estado_reforma_id')?.setValue(null);
      return;
    }

    const [situacao] = this.estado.filter((item: any) => item.id == $event);

    if (!situacao) return;

    const options = {
      sigpq_estado_id: $event,
    };

    this.estadosParaFuncionarioService
      .listarTodos(options)
      .pipe(
        finalize((): void => {
          if (this.estadoReformas.length) {
            this.tituloSituacaoLaboral = situacao.text;
            if (!this.getInfo)
              this.simpleForm.get('sigpq_estado_reforma_id')?.enable();

            this.simpleForm
              .get('sigpq_estado_reforma_id')
              ?.setValidators(this.dataValidalitors);
            // this.simpleForm.get('sigpq_estado_reforma_id')?.setValue(null)
          } else {
            this.simpleForm.get('sigpq_estado_reforma_id')?.disable();
            this.simpleForm.get('sigpq_estado_reforma_id')?.setValue(null);
          }
        })
      )
      .subscribe({
        next: (response: any) => {
          this.estadoReformas = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }

  public selecionarSituacaoLaboral($event: any) {
    this.tituloSituacao = '';

    if (!$event) {
      // this.simpleForm.get('sigpq_estado_id')?.disable();
      // this.simpleForm.get('sigpq_estado_id')?.setValue(null);
      this.selecionarSituacaoLaboralLaboral(null);
      return;
    }
    const [situacao] = this.situacaoEstados.filter(
      (item: any) => item.id == $event
    );
    if (!situacao) return;

    if (
      !['efectividade'].includes(situacao.text.toString().toLocaleLowerCase())
    ) {
      // this.simpleForm.get('tipo_orgao')?.setValue('SAT');
      //this.simpleForm.get('tipo_orgao')?.disable();
      // this.simpleForm.get('tipo_orgao')?.setValue('SAT')?.disable()
      // this.selecionarOrgaoOuComandoProvincial('SAT');
      // this.simpleForm.get('orgao_id')?.setValue('346');
      // this.simpleForm.get('orgao_id')?.disable();
      // this.validarDirecao(null);
      // this.agenteFora = true;
      // this.departamentos = []
      // this.simpleForm.get('departamento_id')?.setValue(null)
      // this.simpleForm.get('departamento_id')?.disable()
      // if (!this.getInfo) {
      //   this.simpleForm.get('sigpq_estado_id')?.enable();
      //   this.simpleForm.get('sigpq_estado_id')?.setValue(null);
      //   this.simpleForm
      //     .get('sigpq_estado_id')
      //     ?.setValidators(this.dataValidalitors);
      //   this.selecionarSituacaoLaboralLaboral(null);
      // }
    } else {
      // if (!this.getInfo) {
      //   this.agenteFora = false;
      //   this.simpleForm.get('tipo_orgao')?.setValue(null);
      //   this.simpleForm.get('tipo_orgao')?.enable();
      //   this.selecionarOrgaoOuComandoProvincial(null);
      //   // this.simpleForm.get('orgao_id')?.setValue(null)?.enable()
      //   this.simpleForm.get('sigpq_estado_id')?.disable();
      //   this.simpleForm.get('sigpq_estado_id')?.setValue(null);
      //   this.selecionarSituacaoLaboralLaboral(null);
      // }
    }

    const options = {
      sigpq_situacao_estado_id: $event,
    };

    this.estadosParaFuncionarioService
      .listarTodos(options)
      .pipe(
        finalize((): void => {
          if (this.estado?.length) {
            this.tituloSituacao = situacao.text;
          }
        })
      )
      .subscribe({
        next: (response: any) => {
          this.estado = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }
}
