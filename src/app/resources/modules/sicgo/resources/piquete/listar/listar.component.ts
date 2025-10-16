import { NgIfContext } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ControloPrendidoService } from '@resources/modules/sicgo/core/config/ControloPrendido.service';
import { EnquadramentoLegalService } from '@resources/modules/sicgo/core/config/EnquandramentoLegal.service';
import { GravidadeService } from '@resources/modules/sicgo/core/config/Gravidade.service';
import { ImportanciaService } from '@resources/modules/sicgo/core/config/Importancia.service';
import { NivelSegurancaService } from '@resources/modules/sicgo/core/config/NivelSeguranca.service';
import { ObjectoCrimeService } from '@resources/modules/sicgo/core/config/ObjectoCrime.service';
import { TipoCrimesService } from '@resources/modules/sicgo/core/config/TipoCrimes.service';
import { ZonaLocalidadeService } from '@resources/modules/sicgo/core/config/ZonaLocalidade.service';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import { Ocorrencia } from '@resources/modules/sicgo/shared/model/ocorrencias.model';
import { Pagination } from '@shared/models/pagination';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Select2OptionData } from 'ng-select2';
import { finalize, Subject, takeUntil, debounceTime, distinctUntilChanged, forkJoin, of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import QRCode from 'qrcode';
import { SecureService } from '@core/authentication/secure.service';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { ProvinciaService } from '@core/services/Provincia.service';
import { TipoCategoriaService } from '@resources/modules/sicgo/core/config/TipoCategoria.service';
import { FamiliaCrimesService } from '@resources/modules/sicgo/core/config/TipicidadeOcorrencia.service';
import { MunicipioService } from '@resources/modules/sicgo/core/config/Municipio.service';
import { DistritoService } from '@resources/modules/sicgo/core/config/Distrito.service';
import { SocketService } from '@core/providers/socket/socket.service';
import { trigger as ngTrigger, transition, style as ngStyle, animate, state, style, trigger } from '@angular/animations';
import { tap } from 'rxjs/operators';

interface OcorrenciaResponse {
  data: Ocorrencia[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
  };
}
@Component({
  selector: 'app-listar-ocorrencia',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ])
    ]),
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('0.5s', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.5s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ListarOcorrenciaComponent implements OnInit, OnDestroy {
  private cache = new Map<string, any>();
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private filtroAnterior: any = {};

  selectAll: boolean = false;
  selectedCount: number | any;
  selectedIds: any = [];
  @Input() isDisabled: boolean = false;
  isSharingEnabled = false;
  @Output() occurrenceSelected = new EventEmitter<any>();
  selectedOccurrence: any;
  public isLoading: boolean = false;
  public pagination = new Pagination();
  ocorrenciasSelecionados: any = [];
  totalBase: number = 0;
  municipio: any;
  distrito: any;
  ocorrencia: any;
  errorMessage: any;
  provincia: string = ''; 
  ocorrenciaVitima: any;  
  public ocorrencias: any[] = [];
  public distritos: any[] = [];
  public municipios: any; 
  public provincias: Array<Select2OptionData> = [];
  public controloPrendidos: Array<Select2OptionData> = [];
  public enquadramentoLegals: Array<Select2OptionData> = [];
  public gravidades: Array<Select2OptionData> = [];
  public importancias: Array<Select2OptionData> = [];
  public tipoOcorrencias: Array<Select2OptionData> = [];
  public nivelSegurancas: Array<Select2OptionData> = [];
  public objectoCrimes: any[] = [];
  public zonaLocalidades: Array<Select2OptionData> = [];
  public tipoOcorrenciasClone: Array<Select2OptionData> = [];
  public tipoCategorias: Array<Select2OptionData> = [];
  public familiaCrimes: Array<Select2OptionData> = [];
  public tipoCategoriasClone: Array<Select2OptionData> = [];
 
  novaOcorrenciaRecebida = false;
  filtroAplicado: boolean = false;

  public estados = [
    { cor: '#cc0000', texto: 'Aberta' },
    { cor: '#ffcc00', texto: 'Em andamento' },
    { cor: 'rgb(0, 143, 251)', texto: 'Com Processo' },
    { cor: '#00cc00', texto: 'Concluido' },
  ];
  public options: any = {
    placeholder: 'Seleciona uma opção',
    width: '100%',
  };

  filtro_na_pesquisa = { search: '' };

  municipioService = inject(MunicipioService);
  distritoService = inject(DistritoService);
  public ocorrenciasFiltradas: any[] = [];

  constructor(
    private ocorrenciaService: OcorrenciaService,
    private socketService: SocketService,
    private enquadramentoLegalService: EnquadramentoLegalService,
    private gravidadeService: GravidadeService,
    private importanciaService: ImportanciaService,
    private tipoOcorrenciaService: TipoCrimesService,
    private nivelSegurancaService: NivelSegurancaService,
    private objectoCrimeService: ObjectoCrimeService,
    private zonaLocalidadeService: ZonaLocalidadeService,
    private formatarDataHelper: FormatarDataHelper,
    private secureService: SecureService,
    private provinciaService: ProvinciaService,
    private tipicidadeOcorrenciaService: FamiliaCrimesService,
    private cdRef: ChangeDetectorRef,
    private tipoCrimesService: TipoCrimesService,
    private tipoCategoriaService: TipoCategoriaService,
    private familiaCrimesService: FamiliaCrimesService,
    private cdr: ChangeDetectorRef,
  ) { }

  // Método chamado sempre que o valor da pesquisa mudar
  filtrarPesquisa(event: any): void {
    //console.log('Campo de pesquisa atualizado:', this.filtro_na_pesquisa.search);
    this.cdr.detectChanges(); // Força a detecção de mudanças para refletir a pesquisa
  }

  ngOnInit(): void {
    this.configurarPesquisa();
    this.carregarDadosIniciais();
    this.iniciarSocket();
  }

  private configurarPesquisa(): void {
    this.searchSubject.pipe( 
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.filtro.search = searchTerm;
      this.buscarOcorrencias();
    });
  }

  private carregarDadosIniciais(): void {
    const dadosParaCarregar = [
      { chave: 'familiaCrimes', metodo: this.buscarFamiliaCrimes.bind(this) },
      { chave: 'objectoCrimes', metodo: this.buscarObjectoCrime.bind(this) },
      { chave: 'tipoOcorrencias', metodo: this.buscarTipoOcorrencias.bind(this) },
      { chave: 'importancias', metodo: this.buscarImportancias.bind(this) },
      { chave: 'zonaLocalidades', metodo: this.buscarZonaLocalidades.bind(this) },
      { chave: 'provincias', metodo: this.buscarProvincia.bind(this) }
    ];

    forkJoin(dadosParaCarregar.map(item => item.metodo())).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  adicionarOcorrencia(ocorrencia: any) {
    this.ocorrencias.unshift(ocorrencia);
    this.ocorrencias = this.ocorrencias.slice(0, 100); // Limita a lista a 100 itens
  }


  iniciarSocket() {
    this.socketService.ouvirEvento('nova_ocorrencia')
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((a:any, b:any) => a.id === b.id)
      )
      .subscribe((novaOcorrencia: any) => {
        if (!novaOcorrencia) return;

        this.ocorrencias = this.ocorrencias.filter(o => o.id !== novaOcorrencia.id);
        this.ocorrencias.unshift(novaOcorrencia);

        if (this.ocorrencias.length > 100) {
          this.ocorrencias.pop();
        }

        this.novaOcorrenciaRecebida = true;
        setTimeout(() => this.novaOcorrenciaRecebida = false, 3000);
      });
  }

  buscarOcorrencias() {
    if (this.isLoading) return;

    const options = { ...this.filtro };
    options.user_id = this.user;

    this.isLoading = true;
    this.ocorrenciaService.listar(options)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response: any) => {
          this.ocorrencias = response.data;
          this.totalBase = this.calcularTotalBase(response.meta)


          this.pagination = this.pagination.deserialize(response.meta);

          // Antes de carregar os dados
          const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

          // Após atualizar os dados
          setTimeout(() => {
            window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
          });
        },
        error: (error) => {
          console.error('Erro ao buscar ocorrências:', error);
        }
      });
  }

  private calcularTotalBase(meta: OcorrenciaResponse['meta']): number {
    return meta.current_page === 1
      ? 1
      : (meta.current_page - 1) * meta.per_page + 1;
  }

  
  selectOccurrence(occurrence: any): void {
    this.ocorrenciaService.setOccurrence(occurrence);
    this.selectedOccurrence = occurrence;
    this.occurrenceSelected.emit(occurrence);
  }

  selectAllOccurrences(): void {
    this.selectAll = !this.selectAll;
    this.ocorrenciasSelecionados = this.selectAll ? [...this.ocorrencias] : [];
    this.selectedCount = this.selectAll ? this.ocorrencias.length : 0;
  }

  shareOccurrence(): void {
    console.log('Ocorrência compartilhada!');
  }


  states: any[] = [];

  public isformularioInA: boolean = true;  // Verifica se o usuário está logado
  public isformularioInB: boolean = false;  // Verifica se o usuário está logado
  formulariosget() {
    const nome = this.orgao;
    if (nome !== "DTSER") {
      this.isformularioInA = false; // Verifica se o usuário está logado
      this.isformularioInB = true;
      this.states = [
        { id: 1, name: 'Transito', abbrev: this.orgao, logo: 'logopolice.png' }
      ];
    } else {
      this.isformularioInA = true; // Verifica se o usuário está logado
      this.isformularioInB = false;
      this.states = [
        { id: 2, name: 'Ordem-Publica', abbrev: this.orgao, logo: 'OIP.jpg' }
      ];
    }

  }

  get nomeUtilizador() {
    return this.secureService.getTokenValueDecode().user.nome_completo
  }

  get user() {
    return this.secureService.getTokenValueDecode().user.id;
  }

  get pessoa_id() {
    return this.secureService.getTokenValueDecode().user.pessoa_id; // Supondo que o pessoa_id esteja disponível no token
  }

  get orgao() {
    return this.secureService.getTokenValueDecode().orgao.sigla;
  }

  get orgao_nome() {
    return this.secureService.getTokenValueDecode().orgao.nome_completo;
  }

  get orgao_id() {
    return this.secureService.getTokenValueDecode().orgao.id;
  }

  get roles() {
    return this.secureService.getTokenValueDecode().user.roles; // Retorna as roles do utilizador
  }

  get permissions() {
    return this.secureService.getTokenValueDecode().user.permissions; // Retorna as permissões do utilizador
  }

  // Filtro que armazena os dados do formulário de filtros
  filtro: any = {
    page: 1,
    perPage: 5,
    search: '',
    familiaCrime: null,
    tipoOcorrencia: null,
    tipoCategoria: null,
    importancia: null,
    provincias: null,
    municipios: null,
    distritos: null,
    data: null,
    data_inicial: null,
    data_final: null
  };

  aplicarFiltro(): void {
    console.log("Valores do filtro aplicados: ", this.filtro);

    // Configura o filtro para buscar até 50 páginas
    const maxPages = 50;
    const perPage = 50; // Número de itens por página
    this.filtro.perPage = perPage;

    // Array para armazenar todas as ocorrências
    let todasOcorrencias: any[] = [];

    const buscarPaginas = async () => {
      for (let page = 1; page <= maxPages; page++) {
        const filtroAtualizado = { ...this.filtro, page, perPage };

        try {
          const response: any = await this.ocorrenciaService.listar(filtroAtualizado).toPromise();
          todasOcorrencias = todasOcorrencias.concat(response.data);

          // Interrompe a busca se não houver mais dados
          if (response.data.length < perPage) {
            break;
          }
        } catch (error) {
          console.error(`Erro ao buscar a página ${page}:`, error);
          break;
        }
      }

      // Aplica o filtro nas ocorrências acumuladas
      this.ocorrenciasFiltradas = todasOcorrencias.filter(item => {
        const familiaCrimeMatches = this.filtro.familiaCrime ? item.sicgo_familia_crime_id == this.filtro.familiaCrime : true;
        const tipoOcorrenciaMatches = this.filtro.tipoOcorrencia ? item.sicgo_tipo_crime_id == this.filtro.tipoOcorrencia : true;
        const tipoCategoriaMatches = this.filtro.tipoCategoria ? item.sicgo_tipicidade_crime_id == this.filtro.tipoCategoria : true;
        const importanciaMatches = this.filtro.importancia ? item.sicg_importancia_id == this.filtro.importancia : true;
        const provinciaMatches = this.filtro.provincias ? item.provincia_id == this.filtro.provincias : true;
        const municipioMatches = this.filtro.municipios ? item.municipio_id == this.filtro.municipios : true;
        const distritoMatches = this.filtro.distritos ? item.distrito_id == this.filtro.distritos : true;

        const filtroDataFormatada = this.filtro.data ? this.convertToApiFormat(this.filtro.data) : '';
        const filtroDataInicialFormatada = this.filtro.data_inicial ? this.convertToApiFormat(this.filtro.data_inicial) : '';
        const filtroDataFinalFormatada = this.filtro.data_final ? this.convertToApiFormat(this.filtro.data_final) : '';

        const dataMatches = filtroDataFormatada ? this.compareDate(item.data_ocorrido, filtroDataFormatada) : true;
        const intervaloDeDataMatches = this.isWithinDateRange(item.data_ocorrido, filtroDataInicialFormatada, filtroDataFinalFormatada);

        return familiaCrimeMatches && tipoOcorrenciaMatches && tipoCategoriaMatches &&
          importanciaMatches && provinciaMatches && municipioMatches &&
          distritoMatches && dataMatches && intervaloDeDataMatches;
      });

      console.log("Ocorrências filtradas: ", this.ocorrenciasFiltradas);

      // Marcar que o filtro foi aplicado
      this.filtroAplicado = true;
    };

    buscarPaginas();
  }

  // Função para comparar a data de ocorrência (data_ocorrido) com a data do filtro (filtro.data)
  compareDate(dataOcorrido: string, filtroData: string): boolean {

    // Comparar as datas sem os minutos, apenas data e hora
    const [day1, month1, year1, hour1] = this.splitDate(dataOcorrido);
    const [day2, month2, year2, hour2] = this.splitDate(filtroData);

    // Comparação apenas com data e hora
    if (day1 === day2 && month1 === month2 && year1 === year2 && hour1 === hour2) {
      return true;
    } else {
      return false;
    }
  }

  // Função para verificar se a data de ocorrência está dentro do intervalo de datas
  isWithinDateRange(dataOcorrido: string, dataInicial: string, dataFinal: string): boolean {

    // Caso o intervalo de datas não tenha sido definido, retornamos true (sem filtro)
    if (!dataInicial && !dataFinal) return true;

    // Convertendo as datas para o formato esperado pela API
    const [dayOcorrido, monthOcorrido, yearOcorrido, hourOcorrido] = this.splitDate(dataOcorrido);
    const [dayInicial, monthInicial, yearInicial, hourInicial] = this.splitDate(dataInicial);
    const [dayFinal, monthFinal, yearFinal, hourFinal] = this.splitDate(dataFinal);

    // Verificar se a data de ocorrência está dentro do intervalo
    const isAfterStart = dataInicial ? (yearOcorrido > yearInicial || (yearOcorrido === yearInicial && monthOcorrido > monthInicial) || (yearOcorrido === yearInicial && monthOcorrido === monthInicial && dayOcorrido >= dayInicial) || (yearOcorrido === yearInicial && monthOcorrido === monthInicial && dayOcorrido === dayInicial && hourOcorrido >= hourInicial)) : true;
    const isBeforeEnd = dataFinal ? (yearOcorrido < yearFinal || (yearOcorrido === yearFinal && monthOcorrido < monthFinal) || (yearOcorrido === yearFinal && monthOcorrido === monthFinal && dayOcorrido <= dayFinal) || (yearOcorrido === yearFinal && monthOcorrido === monthFinal && dayOcorrido === dayFinal && hourOcorrido <= hourFinal)) : true;

    return isAfterStart && isBeforeEnd;
  }

  // Função para separar a data e hora
  splitDate(date: string): string[] {
    const [datePart, timePart] = date.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hour] = timePart.split(':');
    return [day, month, year, hour];
  }

  // Função para transformar a data "dd/MM/yyyy HH" para "yyyy-MM-ddTHH:mm"
  formatDateToISOString(date: string): string {
    const [day, month, year] = date.split(' ')[0].split('/');
    const time = date.split(' ')[1];

    // Formata para 'yyyy-MM-ddTHH:mm'
    return `${year}-${month}-${day}T${time}:00`; // Adiciona minutos para comparar corretamente
  }

  // Função para converter a data "yyyy-MM-ddTHH:mm" para "dd/MM/yyyy HH"
  convertToApiFormat(userDate: string): string {

    // Separa a data e hora
    const [date, time] = userDate.split('T');
    const [year, month, day] = date.split('-');

    // Aqui estamos pegando somente a hora (sem os minutos)
    const formattedDate = `${day}/${month}/${year} ${time.substring(0, 2)}`;

    return formattedDate;
  }


  limparFiltro(): void {
    // Resetar os valores dos campos do filtro
    this.filtro = {
      page: 1,
      perPage: 5,
      search: '',
      familiaCrime: null,
      tipoOcorrencia: null,
      tipoCategoria: null,
      importancia: null,
      provincias: null,
      municipios: null,
      distritos: null,
      data: null
    };

    // Marcar que o filtro não foi aplicado
    this.filtroAplicado = false;
    // Limpar a pesquisa
    this.buscarOcorrencias();
    // Exibir novamente todas as ocorrências (sem filtro)
    this.ocorrenciasFiltradas = [...this.ocorrencias];
  }



  trackById(index: number, item: any): number {
    return item.id;
  }

  //B
  formulariosgett() {
    const siglaOrgao = this.orgao;
    this.isformularioInA = siglaOrgao !== "DTCR";
    this.isformularioInB = !this.isformularioInA;
  }

  buscarComCache(chave: string, observable: Observable<any>): Observable<any> {
    if (this.cache.has(chave)) {
      return of(this.cache.get(chave));
    }

    return observable.pipe(
      tap(data => this.cache.set(chave, data))
    );
  }

  buscarProvincia(): void {
    const chave = 'provincias';
    const request = this.provinciaService.listarTodos({ page: 1, perPage: 18 });

    this.buscarComCache(chave, request).subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response.data)) {
          this.provincias = response.data.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));

          const selectedProvincia = this.provincias.find((provincia: any) => provincia);
          this.provincia = selectedProvincia ? selectedProvincia.text : '';

          this.cdr.detectChanges();
        }
      },
    });
  }

  private buscarObjectoCrime() {
    const chave = 'objectoCrimes';
    const request = this.objectoCrimeService.listarTodos(this.filtro);

    this.buscarComCache(chave, request).subscribe({
      next: (response: any) => {
        this.objectoCrimes = response.data;
        this.pagination = this.pagination.deserialize(response.meta);
      },
    });
  }

  private buscarTipoOcorrencias() {
    const chave = 'tipoOcorrencias';
    const request = this.tipoOcorrenciaService.listarTodos({ page: 1, perPage: 5 });

    this.buscarComCache(chave, request).subscribe({
      next: (response: any) => {
        this.tipoOcorrencias = response.data.map((item: any) => ({
          id: item.id,
          text: item.nome,
          additional: {
            icon: 'fa fa-icon1'
          }
        }));
      },
    });
  }

  private buscarImportancias() {
    const chave = 'importancias';
    const request = this.importanciaService.listarTodos({});

    this.buscarComCache(chave, request).subscribe({
      next: (response: any) => {
        this.importancias = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      },
    });
  }


  private buscarGravidades() {
    const chave = 'gravidades';
    const request = this.gravidadeService.listarTodos({});

    this.buscarComCache(chave, request).subscribe({
      next: (response: any) => {
        this.gravidades = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      },
    });
  }

  private buscarZonaLocalidades() {
    const chave = 'zonaLocalidades';
    const request = this.zonaLocalidadeService.listarTodos({});

    this.buscarComCache(chave, request).subscribe({
      next: (response: any) => {
        this.zonaLocalidades = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      },
    });
  }

  novaOcorrencia() {
    this.ocorrencia = new Ocorrencia();
  }

  editar(item: any) {
    this.ocorrencia = item;
  }

  setOcorencia(item: Ocorrencia) {
    this.ocorrencia = item;
  }

  setOcorenciaVitima(item: Ocorrencia) {
    this.ocorrenciaVitima = item;
  }

  filtrarPagina(key: string, $e: any, reiniciar: boolean = true) {
    if (key === 'perPage') {
      // Atualiza o número de itens por página
      this.filtro.perPage = $e.target.value;
    } else {
      // Atualiza outras propriedades de filtro dinamicamente com base no key
      this.filtro[key] = $e;
    }

    // Se o filtro for reiniciado, a página será resetada para 1
    if (reiniciar) {
      this.filtro.page = 1;
    }

    this.buscarOcorrencias();

  }

  // Método para recarregar a página (limpar filtros)
  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.filtro.familiaCrime = null;
    this.filtro.tipoOcorrencia = null;
    this.filtro.tipoCategoria = null;
    this.filtro.importancia = null;
    this.filtro.provincias = null;
    this.filtro.municipios = null;
    this.filtro.data = null;

    // Busca as ocorrências sem filtros
    this.buscarOcorrencias();
  }

  // Método para buscar as famílias de crimes
  buscarFamiliaCrimes(): void {
    const chave = `familiaCrimes_${this.orgao_id}`;
    const request = this.familiaCrimesService.listarTodos({ page: 1, perPage: 7 });

    this.buscarComCache(chave, request).subscribe({
      next: (response: any) => {
        this.familiaCrimes = response.data
          .filter((item: any) => item.orgaoId === this.orgao_id)
          .map(({ id, nome }: any) => ({ id, text: nome }));
      },
      error: (error: any) => {
        console.error('Erro ao buscar famílias de crimes:', error);
      },
    });
  }

  public handlerTipocrime(evento: any): void {
    if (!evento) return;

    const sicgo_familia_crime_id = evento;

    this.tipoCrimesService.listar(sicgo_familia_crime_id)
      .pipe(finalize(() => console.log('Finalizada a busca por tipos de crimes.')))
      .subscribe({
        next: (response: any) => {
          this.tipoOcorrencias = [...response.map(({ id, nome }: any) => ({ id, text: nome }))];
          this.tipoCategorias = [];
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Erro ao buscar tipos de crimes:', error);
        },
      });
  }

  selecionarCategoriaCrime(evento: any): void {
    if (!evento) return;

    const sicgo_tipo_crime_id = evento;

    this.tipoCategoriaService.listarum(sicgo_tipo_crime_id).subscribe({
      next: (response: any) => {
        this.tipoCategorias = response.map(({ id, nome }: any) => ({ id, text: nome }));
        this.filtro.tipoCategoria = null;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Erro ao buscar categorias de crime:', error);
      }
    });
  }

  public handlerProvincias($event: any) {
    if (!$event) return;

    this.municipio = null;
    this.distrito = null;
    this.municipios = [];
    this.distritos = [];

    const chave = `municipios_${$event}`;
    const request = this.municipioService.listar({ provincia_id: $event });

    this.buscarComCache(chave, request).subscribe((response: any): void => {
      this.municipios = response.map((item: any) => ({
        id: item.id,
        text: item.nome
      }));
    });
  }

  public selecionarMunicipio($event: any) {
    if (!$event) return;

    const chave = `distritos_${$event}`;
    const request = this.distritoService.listarTodos({ municipio_id: $event });

    this.buscarComCache(chave, request).subscribe((response: any): void => {
      this.distritos = response.map((item: any) => ({
        id: item.id,
        text: item.nome
      }));
    });
  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    this.selectedCount = 0;

    this.ocorrencias.forEach((file: { selected: boolean }) => {
      file.selected = this.selectAll;
      if (file.selected) this.selectedCount++;
    });
  }

  // Função para atualizar a contagem quando um checkbox é alterado
  updateSelectedCount() {
    this.selectedCount = this.ocorrencias.filter(
      (file: { selected: any; }) => file.selected
    ).length;
  }

  eliminarSelecionados() {
    if (this.selectedIds.length > 0) {
      const idsParaEliminar = this.selectedIds.map((item: any) => item.id);

      this.isLoading = true;

      const request = this.ocorrenciaService.eliminarMultiplo(idsParaEliminar);

      request.pipe(finalize(() => this.isLoading = false))
        .subscribe(
          (response: any) => {
            alert(response.message);
            this.buscarOcorrencias();
            console.log('IDs eliminados:', idsParaEliminar);
            this.cdRef.detectChanges();
          },
          (error: any) => {
            console.error('Erro ao eliminar:', error);
          }
        );
    } else {
      alert('Nenhum item selecionado!');
    }
  }

  onSelectItem(item: any) {
    const conjuntoUnico = new Set(this.selectedIds);
    const index = conjuntoUnico.has(item);
    if (!index) {
      conjuntoUnico.add(item);
    } else {
      conjuntoUnico.delete(item);
    }
    this.selectedIds = Array.from(conjuntoUnico);
  }

  validarSelecionado(id: number | undefined) {
    const numeroUmExiste = this.selectedIds.find(
      (o: any) => o.id == id
    );
    return !!numeroUmExiste;
  }

  limparVariaveis() {
    this.selectedIds = [];
  }

  // Função para emitir o emitirEtiqueta (exemplo)
  emitirEtiqueta(item: Ocorrencia) {
    this.ocorrencia = item;

    const pdf = new jsPDF('l', 'pt', 'a9');
    let ab = 'assets/img/logopolice.png';
    const ac = 'assets/assets_sicgo/img/kv.jpg';
    pdf.setFontSize(8);

    const x = 20;
    const y = 40;

    autoTable(pdf, {
      didDrawCell: (data) => {
        if (data.section === 'body' && data.column.index === 0) {
          pdf.addImage(ab, 'jpg', data.cell.x + 2, data.cell.y + 2, 10, 10);
          pdf.addImage(ac, 'jpg', data.cell.x + 2, data.cell.y + 2, 10, 10);
        }
      },
    });

    const anoAtual = new Date();

    pdf.setFontSize(7);
    pdf.text('PIQUETE', x - 14, y - 29);
    pdf.text('DATA:', x + 60, y - 29);
    pdf.text(`${this.ocorrencia.data_ocorrido}`, x + 90, y - 29);
    pdf.addImage(ab, 'jpg', x - 14, y - 16, 32, 32);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6);
    pdf.text(`NUM : ${this.ocorrencia.id} - 2025`, x - 14, y + 28);
    pdf.text(`PROV: ${this.ocorrencia.provincia}`, x - 14, y + 38);
    pdf.text(`MUNI: ${this.ocorrencia.municipio}`, x - 14, y + 48);
    pdf.text(`COD : ${this.ocorrencia.codigo_sistema}/SICGO/2025`, x - 14, y + 58);

    pdf.setFontSize(4);
    pdf.text(`*Pela Ordem e Pela Paz*`, x + 70, y + 42);

    const options = {
      quality: 7.3,
      color: {
        dark: '#000000',
        light: '#FFFFFF03'
      },
      margin: 1
    };

    const qrCodeValue = `'PIQUETE: ESQ|${this.orgao}\nData Ocorrencia: ${this.ocorrencia.data_ocorrido}\nRef. Nº: ${this.ocorrencia.id}/Luanda/PNA/${this.ocorrencia.data_ocorrido}\nN. Querelente: ${this.ocorrencia.nome_ocorrente}\nData de Registo: ${this.ocorrencia.created_at}\nProcessado automático por SICGO/PNA/${this.ocorrencia.created_at}'`;
    QRCode.toDataURL(qrCodeValue, options)
      .then((qrUrl: any) => {
        const img = new Image();
        img.src = qrUrl;
        img.onload = () => {
          const qrWidth = 63;
          const qrHeight = 62;
          pdf.addImage(qrUrl, 'PNG', x + 60, y - 24, qrWidth, qrHeight);
          pdf.output('dataurlnewwindow');
        };
      })
      .catch((err: any) => {
        console.error('Erro ao gerar QR code:', err);
      });
  }

  get dataActual() {
    return this.formatarDataHelper.formatDate(null, 'dd/MM/yyyy');
  }
  drawRoundedRect(pdf: jsPDF, x: number, y: number, width: number, height: number, radius: any, color: string) {
    pdf.setLineWidth(0.8);  // Ajusta a espessura da borda
    pdf.setDrawColor(4, 27, 78);  // Cor da borda
    pdf.setFillColor(4, 27, 78); // Cor de preenchimento
    pdf.roundedRect(x, y, width, height, radius, radius, 'FD'); // Desenha e preenche o retângulo
  }



  public async gerarPdf(idELement: any): Promise<any> {

    let blob: any = null;
    const element: any = document.querySelector(`#${idELement}`);
    const doc = new jsPDF('p', 'pt', 'a4')
    const options = {
      background: 'white',
      scale: 3
    }

    return html2canvas(element, options).then((canvas) => {
      const img = canvas.toDataURL('image/PNG')

      const bufferX = 15
      const bufferY = 15

      const imgProps = (doc as any).getImageProperties(img)
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST')
      return doc
    }).then((pdf) => {
      return pdf
    })
  }

  public async imprimir(idELement: any) {
    const source = await this.gerarPdf(idELement)
    const blob = source.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  public async download_(idELement: any) {
    const source = await this.gerarPdf(idELement);
    source.save(`${new Date().toISOString()}_ocrrencia.pdf`);
  }

  public isOffcanvasVisible: number | any = 0;
  public isOffVisible: string | null = null;
  public isData: any[] = [];

  public toggle(id: any): void {
    this.isData = id;
    if (this.isOffcanvasVisible === id.id) {
      this.closeSidebar();
    } else {
      this.openSidebar(id.id);
    }
  }

  private openSidebar(id: number): void {
    this.isOffcanvasVisible = id;
  }

  private closeSidebar(): void {
    this.isOffcanvasVisible = 0;
  }


  buscarId(): number {
    return this.ocorrencia as number;
  }
  public selectedOcorrenciaId: number | any;
  public changeOcorrenciaId(id: any): void {
    if (this.selectedOcorrenciaId == id) {
      this.selectedOcorrenciaId == id;
    } else if (this.selectedOcorrenciaId != id) {
      this.selectedOcorrenciaId = id;
    }
    console.log(this.selectedOcorrenciaId);
  }

  Delete(id: number) {
    this.ocorrenciaService
      .eliminar(id)
      .subscribe({
        next: (response: any) => {
          this.buscarOcorrencias();
        },
        error: (error: any) => {
          console.error('Erro ao reencaminhar documento:', id);
        }
      });
  }

  showBanner: string | null = null;

  abrirfechar(p: any): void {
    if (p.showBannerup !== p.showBannerup) {
      p.showBannerup = true;
    } else {
      p.showBannerup = !p.showBannerup;
    }
  }

  public KV(id: any): void {
    this.isOffVisible = id;
  }

  public data(data: any): void {
    this.isData = data;
  }

  selectedState: any;
  exibirFormulario1: boolean = false;
  exibirFormulario2: boolean = false;
  public selecionarOpcao(event: Event): void {
    const valorSelecionado = (event.target as HTMLSelectElement).value;
    // Aqui, você pode verificar o valor selecionado e tomar a ação apropriada
    // (por exemplo, exibir ou ocultar formulários).
    switch (valorSelecionado) {
      case 'Ordem-Publica':
        this.exibirFormulario1 = true; // Exibe o formulário da Opção 1
        this.exibirFormulario2 = false; // Exibe o formulário da Opção 1
        // Lógica para exibir ou ocultar o formulário da Opção 1
        break;
      case 'Transito':
        this.exibirFormulario1 = false; // Exibe o formulário da Opção 1
        this.exibirFormulario2 = true; // Exibe o formulário da Opção 1
        // Lógica para exibir ou ocultar o formulário da Opção 2
        break;
      // Adicione mais casos conforme necessário
      default:
        this.exibirFormulario1 = false; // Exibe o formulário da Opção 1
        this.exibirFormulario2 = false; // Exibe o formulário da Opção 1
      // Lógica para lidar com outras opções
    }
  }

  public get getTemOcorrenciasSelecionados(): boolean {
    return this.ocorrenciasSelecionados.length > 0;
  }
  public get getMaisOcorrenciasSelecionados(): boolean {
    return this.getTemOcorrenciasSelecionados && this.ocorrenciasSelecionados.length > 1;
  }

}

