import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SecureService } from '../../../../../../../core/authentication/secure.service';
import { FicheiroService } from '../../../../../sicgo/core/service/Ficheiro.service';
import { FormatarDataHelper } from '../../../../../../../core/helper/formatarData.helper';
import { MobilidadeService } from '../../../../../sigpq/core/service/Mobilidade.service';
import { FuncionarioService } from '../../../../../../../core/services/Funcionario.service';
import { ProcessoIndividualService } from '../../../../../sigpq/core/service/Processo-Individual.service';
import { FuncaoService } from '../../../../../sigpq/core/service/Funcao.service';
import { AgregadoFamiliarService } from '../../../../../sigpq/core/service/Agregado-Familiar.service';
import { ProvimentoService } from '../../../../../sigpq/core/service/Provimento.service';
import { CargosService } from '../../../../../sigpq/core/service/Cargos.service';
import { CursoFuncionarioService } from '../../../../../sigpq/core/service/Curso-Funcionario.service';
import { finalize } from 'rxjs';
import jsPDF from 'jspdf';
import { OutrosEmpregosFuncionarioService } from '../../../../../sigpq/core/service/Outros-Empregos-Funcionario.service';
import { AppConfig } from 'app/config/app.config';
const QRCode = require('qrcode');
@Component({
  selector: 'app-extrato-agente-novo',
  templateUrl: './extrato-agente-novo.component.html',
  styleUrls: ['./extrato-agente-novo.component.css']
})
export class ExtratoAgenteNovoComponent implements OnChanges {



  nomeSelecionado: any = "Extracto biográfico"
  qrCodeDataUrl: string | null = null;
  @Input() public pessoaId: any;
  @Input() public options: any
  public isLoading: boolean = false;
  public isLoadingCivil: boolean = false;
  public isLoadingEfectivo: boolean = false;
  public fileUrl: any;
  public fileUrlCivil: any;
  public funcaos: any
  public cargos: any
  public cursos: any
  public cursosAcademicos: any
  public cursosPoliciais: any
  public outosEmpregos: any
  public cursosOutros: any
  public documentos: any = []
  public mobilidades: any
  public provimentos: any
  public sansoes: any
  public recompensas: any
  public agregadosFamiliares: any = []
  public indexes: any = []

  public funcionario: any

  public optionsExportar: any = {
    extracto: false,
    pessoal: false,
    profissional: false,
    provimento: false,
    funcao: false,
    cargo: false,
    mobilidade: false,
    outros_empregos: false,
  }

  getYear() {
    return new Date().getFullYear()
  }
  public ordens: any = {
    pessoal: 1,
    profissional: 1,
    provimento: 1,
    funcao: 1
  }

  /* Configurando as variaveis dinamicas para os estilos */

  tituloPrincipal = AppConfig.orgName; /* Ex: Policia Nacional de Angola OU Serviços  I ... */
  introApp = AppConfig.introApp; /* Ex: Sistema Integrado de Gestao de pessoal e quadros */
  siglaPrincipal = AppConfig.siglaPrincipal; /* Ex: PNA */
  logoPath = AppConfig.logoPath; /* Ex: LOGOTIPO */
  logoBack = AppConfig.logoBack; /* Ex: LOGOTIPO DE FUNDO */
  logoH = AppConfig.logoH; /* Ex: LOGOTIPO DE HEADER */
  imgUser = AppConfig.imgUser; /* Ex: Imagem user */
  useColor = AppConfig.useColor; /* Ex: COR DO TEMA */
  useGradient = AppConfig.useGradient; /* Ex: COR DO GRADIENTE */
  colorPainel = AppConfig.colorPainel; /* Ex: COR DO PAINEL */

  constructor(private readonly secureService: SecureService,
    private ficheiroService: FicheiroService,
    private formatarData: FormatarDataHelper,
    private mobilidadeService: MobilidadeService,
    private historicoEmpregoService: OutrosEmpregosFuncionarioService,
    private funcionarioService: FuncionarioService,
    private processoService: ProcessoIndividualService,
    private funcaoService: FuncaoService, public formatarDataHelper: FormatarDataHelper,
    private agregadoFamiliarService: AgregadoFamiliarService,
    private cargoService: CargosService, private provimentoService: ProvimentoService, private cursoFuncionariosService: CursoFuncionarioService) {
    this.preencherRecompensas()
    this.preencherSansoes()
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pessoaId'].previousValue != changes['pessoaId'].currentValue) {
      // this.imprimir()
      this.buscarFuncionario()
      this.buscarFuncao()
      this.buscarProvimento()
      this.buscarCargos()
      this.buscarMobilidade();
      this.buscarCursos();
      this.buscarProcessoIndividual();
      this.buscarAgregadoFamiliares();
      this.listarhistoricoEmprego();
    }
  }

  listarhistoricoEmprego() {
    const opcao = {
      pessoafisica_id: this.getPessoaId
    }
    this.historicoEmpregoService
      .listar(opcao)
      .subscribe((response) => {

        this.outosEmpregos = response;
        console.log("Empregos:", response)
      })
  }

  private preencherSansoes() {
    this.sansoes = []
    /* this.sansoes=[
      {id:1,designacao:'Demitido por deserção',despacho:'015/25, de 18 de Janeiro'},
      {id:1,designacao:'Punido pelo crime de burla',despacho:'012/24, de 09 de Novembro'},
    ] */
  }

  private preencherRecompensas() {
    this.recompensas = []
    /* this.recompensas=[
      {id:1,designacao:'promoção por distinção',tipo_acto:'promoção',ordem:'012/24, de 09 de Novembro',entidade:'Comandante Geral/PNA'},
      {id:2,designacao:'Licença de prémio',tipo_acto:'premiação',ordem:'012/25, de 19 de Novembro',entidade:' 2.º Comandante Geral'},
    ] */
  }

  private buscarMobilidade() {
    const opcao = {
      pessoafisica_id: this.getPessoaId
    }
    this.mobilidadeService
      .listarPorPessoa(opcao)
      .subscribe((response) => {

        this.mobilidades = response;
        console.log("Mobilidade:", response)

      })
  }

  private buscarAgregadoFamiliares() {
    const opcao = {
      pessoafisica_id: this.getPessoaId
      ,
      activo: 1
    }
    this.agregadoFamiliarService.listar(opcao).pipe().subscribe({
      next: (response: any) => {


        this.agregadosFamiliares = response
        console.log("Dados do agregado familiar:", response)
      }
    });

  }


  private buscarProcessoIndividual() {
    const opcao = {
      pessoafisica_id: this.getPessoaId
      ,
      activo: 1
    }

    this.processoService.listar(opcao).pipe(
      finalize(() => {
      })
    )
      .subscribe((response) => {

        this.documentos = response.filter((documento: any) => {
          // Use includes para verificar se o valor está presente no array
          if (['Pessoal', 'Profissional'].includes(documento.nid)) {
            return true; // Retorna true para incluir o documento no resultado
          } else {
            return false; // Retorna false para excluir o documento do resultado
          }
        });


      })

  }

  private buscarFuncao() {
    const opcao = {
      pessoafisica_id: this.getPessoaId
    }
    this.funcaoService
      .listarTodos(opcao)
      .subscribe((response) => {

        this.funcaos = response;


      })
  }
  private buscarProvimento() {
    const options = {

      pessoa_id: this.getPessoaId
    }
    this.provimentoService
      .listarTodos(options)
      .subscribe((response) => {
        this.provimentos = response;
      })

  }
  private buscarCargos() {
    const opcao = {

      pessoafisicaId: this.getPessoaId
    }
    this.cargoService
      .listarTodos(opcao)
      .subscribe((response) => {


        this.cargos = response
      })
  }
  private buscarFuncionario() {
    this.isLoading = true;
    this.funcionarioService.buscarFicha(this.getPessoaId).pipe(
      finalize(() => {
        this.isLoading = false;
        this.verFoto(this.funcionario?.foto_efectivo)
        this.verFotoCivil(this.funcionario?.foto_civil)
        this.gerarQrcode()
        // const exiteImagem = this.funcionario?.foto_efectivo || this.funcionario?.foto_civil
        // this.verFoto(exiteImagem)
      })
    ).subscribe((response: any) => {
      this.funcionario = response;
      // console.log(response)
    });
  }
  verFoto(urlAgente: any): boolean | void {

    if (!urlAgente) return false

    const opcoes = {
      pessoaId: this.getPessoaId,
      url: urlAgente
    }

    this.isLoadingEfectivo = true;

    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
        this.isLoadingEfectivo = false;
      })
    ).subscribe((file) => {
      this.fileUrl = this.ficheiroService.createImageBlob(file);
    });
  }
  verFotoCivil(urlAgente: any): boolean | void {

    if (!urlAgente) return false

    const opcoes = {
      pessoaId: this.getPessoaId,
      url: urlAgente
    }

    this.isLoadingCivil = true;

    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
        this.isLoadingCivil = false;
      })
    ).subscribe((file) => {
      this.fileUrlCivil = this.ficheiroService.createImageBlob(file);
    });
  }
  public get getPessoaId() {
    return this.pessoaId
  }

  public getDataExtensao(data: any) {
    return this.formatarData?.dataExtensao(data)
  }


  public eData(data: any): boolean {
    return data == null ? false : data != '0000-00-00' ? true : false
  }

  public imprimir = (cv: any) => {
    const paraImprir: any = document.querySelector(`#${cv}`)
    if (paraImprir) {
      setTimeout(() => {
        document.body.innerHTML = paraImprir.outerHTML
        window.print()
        window.location.reload()
      }, 500)

    }
  }
  public onCheck(event: any) {
    this.keepDropdownOpen(event)
    this.optionsExportar[event.target.getAttribute('id')] = event.target.checked
    if (event.target.getAttribute('id').toString().toLowerCase() == 'extracto') {
      const checks: Array<HTMLInputElement> = Array.from(document.querySelectorAll('input[type="checkbox"]'))
      if (!checks) return
      checks.forEach((input: any) => {

        if (event.target.getAttribute('id') != input.getAttribute('id')) {
          if (event.target.checked == true) {

            this.optionsExportar[input?.getAttribute('id')] = input.checked = true;
          } else {
            this.optionsExportar[input?.getAttribute('id')] = input.checked = false;
          }
        }
      })
    } else {
      const check: HTMLInputElement = document.querySelector('input[id="extracto"]') as HTMLInputElement
      if (!check) return
      check.checked = true;
      this.optionsExportar['extracto'] = true;
    }
  }

  public getGenero(genero: any): any {
    const gender = genero.toString().toLowerCase()
    return gender == 'm' ? 'Masculino' : gender == 'f' ? 'Femenino' : undefined;
  }

  private buscarCursos() {
    const opcao = {

      pessoafisica_id: this.getPessoaId,
      activo: 1
    }

    this.cursoFuncionariosService.listar(opcao).pipe(
      finalize(() => {
      })
    )
      .subscribe((response) => {
        console.log("CURSOS:", response)
        this.cursos = response
        this.cursosAcademicos = this.cursos.filter((curso: any) => curso.tipo == 'Formação Acadêmica' || curso.tipo_id == 3);
        this.cursosPoliciais = this.cursos.filter((curso: any) => curso.tipo == 'Formação Técnico Policial' || curso.tipo_id == 2);
        this.cursosOutros = this.cursos.filter((curso: any) => curso.tipo == 'Outras Formações' || curso.tipo_id == 4);
        //console.log("CURSOS:",response)
      })



  }

  public formatDate(data: any): any {
    return this.formatarDataHelper.formatDate(data, 'dd-MM-yyyy')
  }

  public getCurrentDate() {
    const now = new Date();

    // Obter horas, minutos e segundos
    const hours = String(now.getHours()).padStart(2, '0'); // Horas
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Minutos
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Segundos

    const date = new Date().toLocaleDateString('pt-BR');
    // Formatar a hora no formato HH:MM:SS
    const formattedTime = `${date} ${hours}:${minutes}:${seconds}`;
    return formattedTime
  }

  dynamicWidth: number = 431;
  dynamicWidthUp: number = 400;
  public getNameUser() {
    const user = this.secureService.getTokenValueDecode().user
    //return user?.nome_completo;
    return user?.nome_completo;
  }

  selecionarOpcao(label: string) {
    this.nomeSelecionado = this.nomeSelecionado === label ? null : label;
  }


  isDropdownOpenProfissional = false
  isDropdownOpenFormacaoAcademica = false
  isDropdownOpenFormacaoProfissional = false
  isDropdownOpenFormacaoOutras = false
  isDropdownOpenOutrasEmpregos = false
  isDropdownOpenProvimento = false

  isDropdownOpenSancoes = false
  isDropdownRecopensas = false
  isDropdownOpenAgregadoFamiliar = false
  isDropdownOpen = false;
  isDropdownOpenMenu = true;
  isDropdownOpenTitle = false;

  toggleDropdownMenu($event: any) {
    this.keepDropdownOpen($event)
    this.dynamicWidth = 372;
    this.dynamicWidthUp = 400;
    this.isDropdownOpenMenu = !this.isDropdownOpenMenu;
    this.toggleOption('isDropdownOpenMenu', this.isDropdownOpenMenu)
  }

  toggleDropdownSancoes($event: any) {
    this.keepDropdownOpen($event)
    this.dynamicWidth = 371;
    this.dynamicWidthUp = 400;
    this.isDropdownOpenSancoes = !this.isDropdownOpenSancoes;
    this.toggleOption('isDropdownOpenSancoes', this.isDropdownOpenSancoes)
  }

  toggleDropdownRecompensas($event: any) {
    this.keepDropdownOpen($event)
    this.dynamicWidth = 430;
    this.dynamicWidthUp = 460;
    this.isDropdownRecopensas = !this.isDropdownRecopensas;
    this.toggleOption('isDropdownRecopensas', this.isDropdownRecopensas)
  }

  toggleDropdownAgregado($event: any) {
    this.keepDropdownOpen($event)
    this.dynamicWidth = 431;
    this.dynamicWidthUp = 460;
    this.isDropdownOpenAgregadoFamiliar = !this.isDropdownOpenAgregadoFamiliar;
    this.toggleOption('isDropdownOpenAgregadoFamiliar', this.isDropdownOpenAgregadoFamiliar)
  }

  toggleDropdown($event: any) {
    this.keepDropdownOpen($event)
    this.dynamicWidth = 373
    this.dynamicWidthUp = 400;
    this.isDropdownOpen = !this.isDropdownOpen;
    this.toggleOption('isDropdownOpen', this.isDropdownOpen)
  }

  toggleDropdownProfessional($event: any) {
    this.keepDropdownOpen($event)
    this.dynamicWidth = 371;
    this.dynamicWidthUp = 400;
    this.isDropdownOpenProfissional = !this.isDropdownOpenProfissional;
    this.toggleOption('isDropdownOpenProfissional', this.isDropdownOpenProfissional)
  }

  toggleDropdownProfessionalOutros($event: any) {
    this.keepDropdownOpen($event)
    this.dynamicWidth = 371;
    this.dynamicWidthUp = 400;
    this.isDropdownOpenFormacaoOutras = !this.isDropdownOpenFormacaoOutras;
    this.toggleOption('isDropdownOpenFormacaoOutras', this.isDropdownOpenFormacaoOutras)
  }

  toggleDropdownOutrosEmpregos($event: any) {
    this.keepDropdownOpen($event)
    this.dynamicWidth = 371;
    this.dynamicWidthUp = 400;
    this.isDropdownOpenOutrasEmpregos = !this.isDropdownOpenOutrasEmpregos;
    this.toggleOption('isDropdownOpenOutrasEmpregos', this.isDropdownOpenOutrasEmpregos)
  }


  toggleDropdownFormacao($event: any) {
    this.keepDropdownOpen($event)
    this.dynamicWidth = 321;
    this.isDropdownOpenFormacaoAcademica = !this.isDropdownOpenFormacaoAcademica;
    this.toggleOption('isDropdownOpenFormacaoAcademica', this.isDropdownOpenFormacaoAcademica)
  }

  toggleDropdownFormacaoProfissional($event: any) {
    this.keepDropdownOpen($event)
    this.dynamicWidth = 370;
    this.dynamicWidthUp = 400;
    this.isDropdownOpenFormacaoProfissional = !this.isDropdownOpenFormacaoProfissional;
    this.toggleOption('isDropdownOpenFormacaoProfissional', this.isDropdownOpenFormacaoProfissional)
  }

  toggleDropdownProvimento($event: any) {
    this.keepDropdownOpen($event)
    this.dynamicWidth = 440;
    this.dynamicWidthUp = 468;
    this.isDropdownOpenProvimento = !this.isDropdownOpenProvimento;
    this.toggleOption('isDropdownOpenProvimento', this.isDropdownOpenProvimento)
  }

  toggleDropdownTitle($event: any) {
    this.keepDropdownOpen($event)
    this.dynamicWidth = 370;
    this.dynamicWidthUp = 400;
    this.isDropdownOpenTitle = !this.isDropdownOpenTitle
    this.toggleOption('isDropdownOpenTitle', this.isDropdownOpenTitle)
  }
  insertnomeSelecionado(nome: string) {
    this.nomeSelecionado = nome
  }

  toggleOption(activeOption: string, valor: boolean = false) {
    const options = [
      "isDropdownOpenProfissional",
      "isDropdownOpenFormacaoAcademica",
      "isDropdownOpenFormacaoProfissional",
      "isDropdownOpenFormacaoOutras",
      "isDropdownOpenProvimento",
      "isDropdownOpenSancoes",
      "isDropdownRecopensas",
      "isDropdownOpenAgregadoFamiliar",
      "isDropdownOpenMenu",
      "isDropdownOpenTitle",
      "isDropdownOpen"
    ];

    options.forEach(option => {
      (this as any)[option] = false; // Declara que o TypeScript deve tratar isso como dinâmico
    });

    if (options.includes(activeOption)) {
      (this as any)[activeOption] = valor;
    }
  }

  keepDropdownOpen(event: Event) {
    event.preventDefault(); // Evita comportamento padrão
    event.stopPropagation(); // Impede o fechamento do dropdown
  }





  // Declaração das variáveis booleanas para todas as opções
  optionsState: { [key: string]: boolean } = {
    FILIACAO: true,
    ESTADO_CIVIL: true,
    SEXO: true,
    PROVINCIA: true,
    NACIONALIDADE: true,
    NASCIMENTO: true,
    BILHETE_DATA_EMISSAO: true,
    CARTA_DE_CONDUCAO: true,
    PASSAPORTE: true,
    SANGUINEO: true,
    HABILITACAO_LITERARIA: true,
    IBAN: true,
    RESIDENCIA: true,
    BI_NUMERO: true,
    CONTACTO: true,
    ALTERNATIVO: true,
    EMAIL_PESSOAL: true,
    AGREGADO_FAMILIAR: true,
    CURSOS_PROFISSIONAIS: true,
  };

  options_title = [
    { key: 'EXTRATO_BIOGRAFICO', label: 'Extrato Biográfico', id: 'PSEUDONIMO' },
    { key: 'SINTESE_BIOGRAFICA', label: 'Síntese Biográfica', id: 'FILIACAO' },
    { key: 'FICHA_INDIVIDUAL', label: 'Ficha Individual', id: 'ESTADO-CIVIL' },
  ]
  options_aux = [
    { key: 'PSEUDONIMO', label: 'Pseudônimo', id: 'PSEUDONIMO' },
    { key: 'FILIACAO', label: 'Filiação', id: 'FILIACAO' },
    { key: 'ESTADO_CIVIL', label: 'Estado Civil', id: 'ESTADO-CIVIL' },
    { key: 'SEXO', label: 'Sexo', id: 'SEXO' },
    { key: 'PROVINCIA', label: 'Provincia', id: 'PROVINCIA' },
    { key: 'NACIONALIDADE', label: 'Nacionalidade', id: 'NACIONALIDADE' },
    { key: 'NASCIMENTO', label: 'Data de nascimento', id: 'NASCIMENTO' },
    { key: 'IBAN', label: 'IBAN', id: 'IBAN' },
    { key: 'RESIDENCIA', label: 'Residência actual', id: 'RESIDENCIA' },
    {
      key: 'BI_NUMERO',
      label: 'B.I n.º:',
      id: 'BI_NUMERO',
      children: [
        { key: 'BILHETE_DATA_EMISSAO', label: 'Data de Emissão', id: 'BILHETE_DATA_EMISSAO' },
        { key: 'VALIDADE_BILHETE', label: 'Validade', id: 'BILHETE_DATA_EMISSAO' }
      ]
    },
    { key: 'CONTACTO', label: 'Contacto', id: 'CONTACTO' },
    { key: 'ALTERNATIVO', label: 'Em caso emergência ligar para', id: 'ALTERNATIVO' },
    { key: 'EMAIL_PESSOAL', label: 'E-mail Pessoal', id: 'EMAIL-PESSOAL' },
    { key: 'AGREGADO_FAMILIAR', label: 'Agregado familiar', id: 'agregado_familiar' },
    {
      key: 'CARTA_DE_CONDUCAO', label: 'Carta de Condução n.º', id: 'CARTA-DE-CONDUCAO',
      children: [
        { key: 'VALIDADE_CARTA', label: 'Validade', id: 'VALIDADE_CARTA' }
      ]
    },
    {
      key: 'PASSAPORTE', label: 'Passaporte', id: 'PASSAPORTE',
      children: [
        { key: 'VALIDADE_PASSAPORTE', label: 'Validade', id: 'VALIDADE_PASSAPORTE' }
      ]
    },
    { key: 'SANGUINEO', label: 'Grupo Sanguíneo', id: 'SANGUINEO' },
    { key: 'HABILITACAO_LITERARIA', label: 'Habilitações Literárias', id: 'HABILITACAO_LITERARIA' },
    { key: 'CURSOS_PROFISSIONAIS', label: 'Cursos', id: 'CURSOS_PROFISSIONAIS' }
  ];


  professionalOptionsState: { [key: string]: boolean } = {
    NIP: true,
    POSTO: true,
    PSEUDONIMO: true,
    FUNCAO: true,
    NAS: true,
    VINCULO: true,
    SITUACAO_ATUAL: true,
    CARGO: true,
    DATA_DE_INGRESSO: true,
    REGIME: true,
    COLOCACAO: true,
    CLASSE: true,
    CONTACTO_PROF: true,
    EMAIL_PROF: true,
    CURSOS_POLICIAIS: true,
    PROVIMENTO: true,
  };

  professionalOptions: any

  professionalOptions_Especial = [
    { key: 'NIP', label: 'NIP', id: 'NIP' },
    { key: 'POSTO', label: 'Posto', id: 'POSTO' },
    { key: 'NAS', label: 'NAS', id: 'NAS' },
    { key: 'VINCULO', label: 'Vínculo', id: 'VINCULO' },
    { key: 'CARGO', label: 'Cargo', id: 'CARGO' },
    { key: 'REGIME', label: 'Regime', id: 'REGIME' },
    { key: 'FUNCAO', label: 'Função', id: 'FUNCAO' },
    { key: 'COLOCACAO', label: 'Colocação', id: 'COLOCACAO' },
    { key: 'CLASSE', label: 'Classe', id: 'CLASSE' },
    { key: 'CONTACTO_PROF', label: 'Contacto profissional', id: 'CONTACTO-PROF' },
    { key: 'EMAIL_PROF', label: 'Email Profissional', id: 'EMAIL-PROF' },
    { key: 'SITUACAO_ATUAL', label: 'Situação atual', id: 'SITUACAO-ATUAL' },
    {
      key: 'DATA_DE_INGRESSO', label: 'Data de ingresso', id: 'DATA_DE_INGRESSO', children: [
        { key: 'DESPACHO_PROFISSIONAL', label: 'Despacho', id: 'DESPACHO_PROFISSIONAL' },
        { key: 'TEMPO_DE_SERVICO', label: 'Tempo de serviço', id: 'TEMPO_DE_SERVICO' }
      ]
    }
  ];

  professionalOptions_Geral = [
    { key: 'RG', label: 'RG', id: 'NIP' },
    { key: 'CATEGORIA_POSTO', label: 'Categoria/Cargo', id: 'CATEGORIA_POSTO' },
    { key: 'NAS', label: 'NAS', id: 'NAS' },
    { key: 'COLOCACAO', label: 'Colocação', id: 'COLOCACAO' },
    { key: 'CONTACTO_PROF', label: 'Contacto profissional', id: 'CONTACTO-PROF' },
    { key: 'EMAIL_PROF', label: 'Email Profissional', id: 'EMAIL-PROF' },
    { key: 'VINCULO', label: 'Vínculo', id: 'VINCULO' },
    { key: 'SITUACAO_ATUAL', label: 'Situação atual', id: 'SITUACAO-ATUAL' },
    {
      key: 'DATA_DE_INGRESSO', label: 'Data de admissão', id: 'DATA_DE_INGRESSO', children: [
        { key: 'DESPACHO_PROFISSIONAL', label: 'Despacho', id: 'DESPACHO_PROFISSIONAL' },
        { key: 'TEMPO_DE_SERVICO', label: 'Tempo de serviço', id: 'TEMPO_DE_SERVICO' }
      ]
    }
  ];

  ProvimentoOptionsState: { [key: string]: boolean } = {
    POSTO_PROVIMENTO: true,
    ACTO_PROVIMENTO: true,
    ORDEM_PROVIMENTO: true,
    DITURNIDADE_PROVIMENTO: true,
    CARGO_PROVIMENTO: true,
    ACTO_CARGO: true,
    DESPACHO_CARGO: true,
    DITURNIDADE_ACRGO: true,
    MOBILIDADE: true,
    DESPACHO_MOBILIDADE: true,
    GUIA_MOBILIDADE: true,
    DITURNIDADE_MOBILIDADE: true,
  };

  provimentoOptions = [
    { key: 'POSTO_PROVIMENTO', label: 'posto', id: 'POSTO_PROVIMENTO', children: [{ key: 'ACTO_PROVIMENTO', label: 'Tipo de acto', id: 'ACTO_PROVIMENTO' }, { key: 'ORDEM_PROVIMENTO', label: 'Ordem n.º', id: 'ORDEM_PROVIMENTO' }, { key: 'DITURNIDADE_POSTO', label: 'Diturnidade', id: 'DITURNIDADE_POSTO' }] },
    { key: 'CARGO_FUNCAO', label: 'Cargo/Funcao', id: 'CARGO_FUNCAO', children: [{ key: 'ACTO_CARGO', label: 'Tipo de acto', id: 'ACTO_CARGO' }, { key: 'DESPACHO_CARGO', label: 'Despacho n.º', id: 'DESPACHO_CARGO' }, { key: 'DITURNIDADE_CARGO', label: 'Diturnidade', id: 'DITURNIDADE_CARGO' }] },
    { key: 'MOBILIDADE', label: 'Mobilidade', id: 'MOBILIDADE', children: [{ key: 'DESPACHO_MOBILIDADE', label: 'Despacho n.º', id: 'DESPACHO_MOBILIDADE' }, { key: 'GUIA_MOBILIDADE', label: 'Guia n.º', id: 'GUIA_MOBILIDADE' }, { key: 'DITURNIDADE_MOBILIDADE', label: 'Diturnidade', id: 'DITURNIDADE_MOBILIDADE' }] },
  ];

  formacaoOptionsState: { [key: string]: boolean } = {
    CURSO_ACADEMICO: true,
    INSTITUICAO_ACADEMICO: true,
    ANO_ACADEMICO: true,
  };

  formacaoAcademicaOptions = [
    {
      key: 'CURSO_ACADEMICO', label: 'Curso', id: 'CURSO_ACADEMICO', children: [
        { key: 'INSTITUICAO_ACADEMICO', label: 'Instituição', id: 'INSTITUICAO_ACADEMICO' },
        { key: 'ANO_ACADEMICO', label: 'Ano', id: 'ANO_ACADEMICO' }
      ]
    }
  ];

  formacaoOutrasOptionsState: { [key: string]: boolean } = {
    CURSO_OUTROS: true,
    INSTITUICAO_OUTROS: true,
    ANO_OUTROS: true,
  };
  formacaoOutrasOptions = [
    {
      key: 'CURSO_OUTROS', label: 'Curso', id: 'CURSO_OUTROS', children: [
        { key: 'INSTITUICAO_OUTROS', label: 'Instituição', id: 'INSTITUICAO_OUTROS' },
        { key: 'ANO_OUTROS', label: 'Ano', id: 'ANO_OUTROS' }
      ]
    }
  ];

  outrosEmpregosOptionsState: { [key: string]: boolean } = {
    EMPRESA: true,
    CARGO: true,
    DITURNIDADE: true,
    CONTRATO: true,
  };
  outrosEmpregosOptions = [
    {
      key: 'EMPRESA', label: 'Empresa', id: 'EMPRESA', children: [
        { key: 'CARGO', label: 'Cargo', id: 'CARGO' },
        { key: 'CONTRATO', label: 'Tipo de Contrato', id: 'CONTRATO' },
        { key: 'DITURNIDADE', label: 'Tempo', id: 'DITURNIDADE' }
      ]
    }
  ];

  formacaoProfissionalOptionsState: { [key: string]: boolean } = {
    CURSO_PROFISSIONAL: true,
    INSTITUICAO_PROFISSIONAL: true,
    ANO_PROFISSIONAL: true,
  };
  formacaoProfissionalOptions = [
    {
      key: 'CURSO_PROFISSIONAL', label: 'Curso', id: 'CURSO_PROFISSIONAL', children: [
        { key: 'INSTITUICAO_PROFISSIONAL', label: 'Instituição', id: 'INSTITUICAO_PROFISSIONAL' },
        { key: 'ANO_PROFISSIONAL', label: 'Ano', id: 'ANO_PROFISSIONAL' }
      ]
    }
  ];

  sansaoOptionsState: { [key: string]: boolean } = {
    DESIGNACAO_SANCAO: true,
    DESPACHO_SANCAO: true,
  };

  sansaoDiciplinarOptions = [
    {
      key: 'DESIGNACAO_SANCAO', label: 'Designação', id: 'DESIGNACAO_SANCAO', children: [
        { key: 'DESPACHO_SANCAO', label: 'Despacho n.º', id: 'DESPACHO_SANCAO' }
      ]
    }
  ];

  recompensasOptionsState: { [key: string]: boolean } = {
    DESIGNACAO_RECOMPENSA: true,
    ACTO_RECOMPENSA: true,
    ORDEM_RECOMPENSA: true,
    ENTIDADE_RECOMPENSA: true,
  };

  recompensasOptions = [
    { key: 'DESIGNACAO_RECOMPENSA', label: 'Designação', id: 'DESIGNACAO_RECOMPENSA', children: [{ key: 'ACTO_RECOMPENSA', label: 'Tipo de acto', id: 'ACTO_RECOMPENSA' }, { key: 'ORDEM_RECOMPENSA', label: 'Ordem n.º', id: 'ORDEM_RECOMPENSA' }, { key: 'ENTIDADE_RECOMPENSA', label: 'Entidade', id: 'ENTIDADE_RECOMPENSA' }] },
  ];

  agregadoOptionsState: { [key: string]: boolean } = {

    NOME_AGREGADO: true,
    RELACAO: true,
    NASCIMENTO_AGREDADO: true,
    CONTACTO_AGREGADO: true,

  };

  agregadoFamiliarOptions = [
    { key: 'NOME_AGREGADO', label: 'Nome', id: 'NOME_AGREGADO', children: [{ key: 'RELACAO', label: 'Relação', id: 'RELACAO' }, { key: 'NASCIMENTO_AGREDADO', label: 'Data de nascimento', id: 'NASCIMENTO_AGREDADO' }, { key: 'CONTACTO_AGREGADO', label: 'Contacto', id: 'CONTACTO_AGREGADO' }] },
  ];


  onOptionCheck(option: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.optionsState[option] = isChecked;
    this.professionalOptionsState[option] = isChecked;
    this.formacaoOptionsState[option] = isChecked;
    this.formacaoProfissionalOptionsState[option] = isChecked;
    this.formacaoOutrasOptionsState[option] = isChecked;
    this.ProvimentoOptionsState[option] = isChecked;
    this.agregadoOptionsState[option] = isChecked;
    this.recompensasOptionsState[option] = isChecked;
    this.sansaoOptionsState[option] = isChecked;

  }

  calcularIdade(dataNascimento: any) {
    const hoje = new Date(); // Data atual
    const dataNasc = dataNascimento.split('/') // Converte a string para objeto Date

    let idade = hoje.getFullYear() - Number(dataNasc[2]); // Diferença entre os anos


    /*
    if (
      mesAtual < dataNasc.getMonth() ||
      (mesAtual === dataNasc.getMonth() && diaAtual < dataNasc.getDate())
    ) {
      idade--;
    } */

    return idade + ' anos';
  }

  calcularIdade_Guia(dataNascimento: any) {
    const hoje = new Date(); // Data atual
    const dataNasc = dataNascimento.split('/') // Converte a string para objeto Date

    let idade = hoje.getFullYear() - Number(dataNasc[3]); // Diferença entre os anos


    /*
    if (
      mesAtual < dataNasc.getMonth() ||
      (mesAtual === dataNasc.getMonth() && diaAtual < dataNasc.getDate())
    ) {
      idade--;
    } */

    return idade + ' anos';
  }

  gerarQrcode() {
    const dataAtual = new Date();

    const options = {
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      margin: 1
    };

    const nome_completo = this.funcionario?.nome_completo;
    const patente_nome = this.funcionario?.patente_nome;
    const colocacao = this.funcionario?.sigpq_tipo_orgao?.sigla;
    const data_da_emissao_do_documento = `${dataAtual.getDate()}-${dataAtual.getMonth() + 1}-${dataAtual.getFullYear()}`;


    const dados = {
      nome_completo,
      patente_nome,
      colocacao,
      nome_do_documento: this.nomeSelecionado.toUpperCase(),
      data_da_emissao_do_documento
    };

    const qrCodeValue = JSON.stringify(dados);
    QRCode.toDataURL(qrCodeValue, options)
      .then((url: any) => {
        this.qrCodeDataUrl = url
        console.log("QRCODE:", this.qrCodeDataUrl)
      })
      .catch((err: any) => {
        console.error('Erro ao gerar QR code:', err);
      });

    this.professionalOptions = this.funcionario?.regime_nome == 'Especial' ? this.professionalOptions_Especial : this.professionalOptions_Geral;
  }



}
