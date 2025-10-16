import { Component, EventEmitter, ViewChild, ElementRef, Input, OnChanges, OnInit, Output, OnDestroy, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CursoService } from '@core/services/config/Curso.service';
import { TipoSanguineoService } from '@core/services/config/TipoSanguineo.service';
import { EstadoCivilService } from '@core/services/EstadoCivil.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { PaisService } from '@core/services/Pais.service';
import { ProvinciaService } from '@core/services/Provincia.service';
import { DistritoService } from '@resources/modules/sigpq/core/service/config/Distrito.service';
import { MunicipioService } from '@resources/modules/sigpq/core/service/config/Municipio.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs/operators';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { pastOrPresentDateValidator } from '@resources/modules/sicgo/shared/datavalidadorkv';
import { TipoHabilitacaoLiterariaService } from '@resources/modules/sigpq/core/service/Tipo-habilitacao-literaria.service';
import { FronteiraService } from '@resources/modules/sicgo/core/config/Fronteiras.service';
import { TipoIdentidadeService } from '@resources/modules/sicgo/core/config/TipoIdentidade.service';
import { ExpedienteService } from '@resources/modules/sicgo/core/service/piquete/dinfop/expediente/expediente.service';
import { AuthService } from '@core/authentication/auth.service';

declare var bootstrap: any; // Para manipulação do modal Bootstrap

@Component({
  selector: 'sigop-registar-ou-editar-delituoso',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;

   selectedSkinColor: string = '#7c4222';
  selectedEyeColor: string = '#222222';
  selectedHairColor: string = '#242424';
  selectedGender: string = 'masculino';
  capturedImages: { left?: string; front?: string; right?: string } = {};
  capturedDescriptors: { left?: number[]; front?: number[]; right?: number[] } = {};

  avEyes: HTMLElement | null;
  avMouth: HTMLElement | null;
  avEyebrow: HTMLElement | null;
  cor: any;

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };



  @Input() delitouso: any = null;
  @Output() eventRegistarOuEditar = new EventEmitter<boolean>();

  public tabCount: number = 0;
  @Input() public params: any
  currentStep: number = 1; // Certifique-se de que começa em 1

  tituloVinculo: string = ''

  public abrirCameraCivil: boolean = false;
  public abrirCamera: boolean = false;

  public fileUrlCivil: any = null;
  public formError: any

  public submitted: boolean = false;
  public isLoading: boolean = false;
  public formErrors: any
  Form: FormGroup = new FormGroup({});

  //cor dos olhos
  olhocor: string | any;
  public olhos = [
    { id: 1, name: 'castanho' },
    { id: 2, name: 'castanho_claro' },
    { id: 3, name: 'azul' },
    { id: 4, name: 'azul_claro' },
    { id: 5, name: 'verde' },
    { id: 6, name: 'verde_claro' },
    { id: 7, name: 'sizento' },
    { id: 8, name: 'sizento_claro' }
  ];
  //kv
  selectedItems: any[] = [];
  mode: string | any;
  //raça
  public it = [
    { id: 1, name: 'Negra', cor: '#574040' },
    { id: 2, name: 'Braca', cor: '#FCC986' }
  ];

  photos: { side: string, dataUrl: string }[] = [];
  capturedImage: string | undefined;
  selectedTipoIdentidade: number | number = 0;
  isFronteiraDisabled: boolean = true; // Inicialmente desabilitado


  public condicao: string | any;
  public pais: Array<Select2OptionData> = [];
  public provincia: Array<Select2OptionData> = [];
  public municipio: Array<Select2OptionData> = [];
  public estadocivil: Array<Select2OptionData> = [];
  public unidades: Array<Select2OptionData> = [];
  public distritos: Array<Select2OptionData> = [];
  public fronteira: Array<Select2OptionData> = [];
  public tipoIdentidade: Array<Select2OptionData> = [];

  cursos: any;
  tipoHabilitacaoLiterarias: any;
  process = { tipoExpediente: '', numeroExpediente: '', occurrenceId: null };


  selectedOccurrence: any;

  constructor(
    private estadoCivilService: EstadoCivilService,
    private tipoIdentidadeService: TipoIdentidadeService,
    private provinciaService: ProvinciaService,
    private paisService: PaisService,
    private fronteiraService: FronteiraService,
    private router: Router,
    private cursoService: CursoService,
    private tipoHabilitacaoLiterariaService: TipoHabilitacaoLiterariaService,
    private municipioService: MunicipioService,
    private distritoService: DistritoService,
    private DinfopDelitousoService: DinfopDelitousoService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private expedienteService: ExpedienteService,
  ) {
    this.avEyes = null;
    this.avMouth = null;
    this.avEyebrow = null;

    this.createForm();
  }

  ngOnInit(): void {

    this.createForm();
    this.buscarProvincia();
    this.buscarMunicipio();
    this.buscarPais();
    this.buscarEstado();
    this.buscarProvincia();
    this.buscarTipoIdentidade();
    this.buscarFronteiras();
    this.buscarTipoHabilitacaoLiteraria()

    // Inicialmente desativa o campo "fronteira" caso necessário
    this.Form.get('documentType')?.valueChanges.subscribe(value => {
      this.toggleFronteiraField(value);
    });


    //avatar
    if (this.params?.getId || this.params?.getInfo) {
      this.createForm();

      if (this.params?.getId || this.params?.getInfo) {
        this.getDataForm();
      }
    }

  
  
    this.expedienteService.currentExpedienteSource.subscribe((occurrence) => {
      this.selectedOccurrence = occurrence;
      this.process.occurrenceId = occurrence?.id;
    });
  }

  ngAfterViewInit(): void {
 
  }

 


  generoSelecionado: string = '';

   

    onGeneroChange(event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        this.generoSelecionado = selectElement.value;
    }






  // Função que habilita ou desabilita os campos com base no tipo de documento
  toggleFronteiraFields($event: any) {
    if (!$event) return
    const selectedDocument = $event.target.value;
    console.log("Tipo de documento selecionado:", selectedDocument);
    if (selectedDocument === 4) {
      // Ativa os campos
      this.isFronteiraDisabled = true;
      this.Form.get('fronteira_id')?.enable();
      this.Form.get('dataentrada_angola')?.enable();
    } else {
      // Desativa os campos
      this.isFronteiraDisabled = false;
      this.Form.get('fronteira_id')?.disable();
      this.Form.get('dataentrada_angola')?.disable();
    }

    // Forçar detecção de mudanças, caso necessário
    this.cdr.detectChanges();
  }
  // Função que habilita ou desabilita os campos com base no tipo de documento
  onTipoIdentidadeChange(id: any) {
    const selectedItem = this.tipoIdentidade.find(item => item.id === id);
    if (selectedItem) {
      //this.toggleFronteiraField(selectedItem.text);
    }
  }

  // Função chamada ao mudar o tipo de documento
  onDocumentTypeChange(event: any) {
    const selectedDocument = event.target.value;
    this.toggleFronteiraField(selectedDocument);
  }
  toggleFronteiraField(documentType: number) {
    if (documentType == 4) {
      this.isFronteiraDisabled = false;
      this.Form.get('fronteira_id')?.enable();
      this.Form.get('dataentrada_angola')?.enable();
    } else {
      this.isFronteiraDisabled = true;
      this.Form.get('fronteira_id')?.disable();
      this.Form.get('dataentrada_angola')?.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges) {

    this.buscarProvincia();
    this.buscarMunicipio();
    this.buscarPais();
    this.buscarEstado();
    if (this.buscarId()) {
      this.getDataForm();
    }

  }


  atualizar(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.cor = Number(inputElement.value);
  }


  onCheckboxChange(event: any, item: any) {
    if (event.target.checked) {
      this.selectedItems.push(item);
    } else {
      const index = this.selectedItems.indexOf(item);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      }
    }
  }

  get orgao() {
    return this.authService.orgao.sigla;
  }


  buscarPais() {
    const options = {};
    this.paisService
      .listar(options)
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.pais = response.map((item: any) => ({
            id: item.id,
            text: item.nacionalidade,
          }));
        },
      });
  }

  buscarMunicipio() {
    const options = {};
    this.municipioService
      .listar(options)
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.municipio = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }

  buscarEstado() {
    const options = {};
    this.estadoCivilService
      .listar(options)
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.estadocivil = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }

  buscarProvincia() {
    const options = {};
    this.provinciaService
      .listarTodos(options)
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.provincia = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }

  buscarFronteiras() {
    const options = {};
    this.fronteiraService
      .listarTodos(options)
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.fronteira = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }

  buscarTipoIdentidade() {
    const options = {};
    this.tipoIdentidadeService
      .listarTodos(options)
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.tipoIdentidade = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }
  private listarCursos() {
    const opcoes = {
      tipo: 'Formação Acadêmica'
    }

    this.cursoService.listarTodos(opcoes).pipe(
      finalize(() => {
      })
    ).subscribe((response) => {
      this.cursos = response.map((item: any) => ({ id: item.id, text: item.nome }))
    });
  }

  private buscarTipoHabilitacaoLiteraria(): void {
    const opcoes = {}
    this.tipoHabilitacaoLiterariaService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.tipoHabilitacaoLiterarias = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })
  }
  model: string | any;

  altura: number = 150; // Valor inicial

  atualizarAltura(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.altura = Number(inputElement.value);
  }

  createForm() {
    this.Form = this.fb.group({
      nome: ['', [Validators.required]],
      apelido: ['', [Validators.required]],
      alcunha: ['', [Validators.required]],
      nomePai: ['', [Validators.required]],
      nomeMae: ['', [Validators.required]],
      sicgo_naturalidade_id: ['', [Validators.required]],
      sicgo_provincia_id: ['', [Validators.required]],
      sicgo_municipio_id: ['', [Validators.required]],
      dataNascimento: ['', [Validators.required]],
      sicgo_estadocivil_id: ['', [Validators.required]],
      profissao: ['', [Validators.required]],
      habilitacaoL: ['', [Validators.required]],
      residencia: ['', [Validators.required]],
      residencia_profissional: ['', [Validators.required]],
      sicgo_nacionalidade_id: ['', [Validators.required]],
      tipo_identidade_id: ['', [Validators.required]],
      numero_identidade: ['', [Validators.required]],
      dataEmissao: ['', [Validators.required, pastOrPresentDateValidator()]],
      localEmissao: ['', [Validators.required]],
      dataentrada_angola: [{ value: '', disabled: this.isFronteiraDisabled }],
      fronteira_id: [{ value: '', disabled: this.isFronteiraDisabled }],
      // motivoDaSuspeita: ['', [Validators.required]],
      // Características
      altura: ['', [Validators.required]],
      raca: ['', [Validators.required]],
      cor_olhos: ['', [Validators.required]],
      cabelo: ['', [Validators.required]],
      nariz: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      caracteristicas: ['', [Validators.required]],
    });

  }


  getDataForm() {
    console.log('Dados de delitouso:', this.delitouso); // Verificar dados que estão sendo passados

    this.Form.patchValue({
      id: this.delitouso.id,
      nome: this.delitouso.nome,
      apelido: this.delitouso.apelido,
      alcunha: this.delitouso.alcunha,
      nomePai: this.delitouso.nomePai,
      nomeMae: this.delitouso.nomeMae,
      sicgo_naturalidade_id: this.delitouso.sicgo_naturalidade_id,
      sicgo_provincia_id: this.delitouso.sicgo_provincia_id,
      sicgo_municipio_id: this.delitouso.sicgo_municipio_id,
      dataNascimento: this.delitouso.dataNascimento,
      sicgo_estadocivil_id: this.delitouso.sicgo_estadocivil_id,
      profissao: this.delitouso.profissao,
      habilitacaoL: this.delitouso.habilitacaoL,
      residencia: this.delitouso.residencia,
      residencia_profissional: this.delitouso.residencia_profissional,
      sicgo_nacionalidade_id: this.delitouso.sicgo_nacionalidade_id,
      tipo_identidade_id: this.delitouso.tipo_identidade_id,
      numero_identidade: this.delitouso.numero_identidade,
      dataEmissao: this.delitouso.dataEmissao,
      localEmissao: this.delitouso.localEmissao,
      dataentrada_angola: this.delitouso.dataentrada_angola,
      fronteira_id: this.delitouso.fronteira_id,
      // Características
      altura: this.delitouso.altura,
      raca: this.delitouso.raca,
      cor_olhos: this.delitouso.cor_olhos,
      cabelo: this.delitouso.cabelo,
      nariz: this.delitouso.nariz,
      genero: this.delitouso.genero,
    });
  }

  onSubmit() {
    this.submitted = true;
    console.log('Form Submitted: ', this.Form);
    console.log('Form Valid: ', this.Form.valid);

    // Garantir que o formulário só seja submetido se estiver válido e não estiver carregando
    if (this.isLoading) {
      // Se estiver carregando, não faz nada
      console.log('Aguardando... Já está carregando');
      return;
    }

    if (this.Form && this.Form.valid) {
      // Log de cada campo para verificar se está correto
      Object.keys(this.Form.controls).forEach(key => {
        const control = this.Form.get(key);
        if (control) {
          console.log(`Campo "${key}" - Erros:`, control.errors, `- Valor:`, control.value);
        }
      });
   
      this.isLoading = true;
      const formData = {
        ...this.Form.value,
        orgao: this.orgao,
      };
      
      // Envia para o serviço de registrar ou editar
      const type = this.buscarId()
        ? this.DinfopDelitousoService.editar(formData, this.buscarId())
        : this.DinfopDelitousoService.registar(formData);

      type.pipe(
        finalize(() => {
          this.isLoading = false;
          this.submitted = false;
        })
      )
        .subscribe({
          next: (response) => {
            setTimeout(() => {
              window.location.reload();
            }, 700);
            this.removerModal();
            this.reiniciarFormulario();
            this.eventRegistarOuEditar.emit(true);
          },
          error: (err) => {
            console.error('Erro ao registrar/editar:', err);
            this.formErrors = err;
            console.error('Detalhes do erro do servidor:', err.error);  // Exibe os detalhes completos do erro
          }
        });
    } else {
      // Formulário inválido, exibe erro
      console.log('Formulário inválido', this.Form.errors);
      Object.keys(this.Form.controls).forEach(key => {
        const control = this.Form.get(key);
        if (control && control.errors) {
          console.log(`Erro no campo "${key}":`, control.errors);
        }
      });
    }
  }


  reiniciarFormulario() {
    this.Form.reset();
  }

  buscarId(): number {
    return this.delitouso?.id as number
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  changeView(novaVisao: string) {
    this.condicao = novaVisao;
  }




  public handlerProvincias($event: any) {
    if (!$event) return

    const opcoes = {
      provincia_id: $event
    }

    this.municipioService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.municipio = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })

  }
  public selecionarMunicipio($event: any) {
    if (!$event) return
    this.distritoService.listarTodos({ municipio_id: $event }).pipe().subscribe({
      next: (respponse: any) => {
        this.distritos = respponse.map((item: any) => ({ id: item.id, text: item.nome }))
      }
    })
  }





  markAllFieldsAsTouched() {
    Object.keys(this.Form.controls).forEach(field => {
      const control = this.Form.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }





  // Progresso em %
  getProgressPercent(): number {
    return (this.currentStep / 2) * 100;
  }


  // Função para validação da data de nascimento
  getBirthdateValidation() {
    const today = new Date();
    const minDate = new Date();
    const maxDate = new Date();

    // Subtrai 10 anos e 89 anos da data de hoje
    minDate.setFullYear(today.getFullYear() - 89);
    maxDate.setFullYear(today.getFullYear() - 10);

    // Formata as datas no formato yyyy-mm-dd
    const minDateString = minDate.toISOString().split('T')[0];
    const maxDateString = maxDate.toISOString().split('T')[0];

    return { min: minDateString, max: maxDateString };
  }

  // Função para validação da data atual (não permite datas futuras)
  getDateValidation() {
    const today = new Date();

    // Formata a data de hoje no formato yyyy-mm-dd
    const todayString = today.toISOString().split('T')[0];

    return { max: todayString };
  }

  // Valida dados primários (Etapa 0)
  // validatePrimary0Data(): boolean {
  //   return !!this.Form.get('motivoDaSuspeita')?.valid;
  // }
  // Valida dados primários (Etapa 1)
  validatePrimaryData(): boolean {
    return !!this.Form.get('nome')?.valid &&
    !!this.Form.get('apelido')?.valid &&
    !!this.Form.get('alcunha')?.valid &&
      !!this.Form.get('nomePai')?.valid &&
      !!this.Form.get('nomeMae')?.valid &&
      !!this.Form.get('sicgo_naturalidade_id')?.valid &&
      !!this.Form.get('sicgo_provincia_id')?.valid &&
      !!this.Form.get('sicgo_municipio_id')?.valid &&
      !!this.Form.get('dataNascimento')?.valid &&
      !!this.Form.get('sicgo_estadocivil_id')?.valid;
  }


  // Valida dados secundários (Etapa 2)
  validateSecondaryData(): boolean {
    return !!this.Form.get('profissao')?.valid &&
      !!this.Form.get('habilitacaoL')?.valid &&
      !!this.Form.get('residencia')?.valid &&
      !!this.Form.get('residencia_profissional')?.valid &&
      !!this.Form.get('sicgo_nacionalidade_id')?.valid &&
      !!this.Form.get('tipo_identidade_id')?.valid &&
      // !!this.Form.get('fronteira_id')?.valid &&
      // !!this.Form.get('numero_identidade')?.valid &&
      !!this.Form.get('dataEmissao')?.valid &&
      !!this.Form.get('localEmissao')?.valid;
  }

  // Valida características (Etapa 3)
  validateCharacteristics(): boolean {
    return !!this.Form.get('altura')?.valid &&
      !!this.Form.get('raca')?.valid &&
      !!this.Form.get('cor_olhos')?.valid &&
      !!this.Form.get('cabelo')?.valid &&
      !!this.Form.get('nariz')?.valid &&
      !!this.Form.get('genero')?.valid &&
      !!this.Form.get('caracteristicas')?.valid;
  }

  canSubmit(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.validatePrimaryData();
      case 2:
        return this.validateSecondaryData();
      case 3:
        return this.validateCharacteristics();
      default:
        return false;
    }
  }

  nextStep(): void {
    if (this.canSubmit()) {
      this.currentStep += 1;
      localStorage.setItem('validarStep', this.currentStep.toString());
      // Resetar erros visuais ao avançar
      this.Form.markAsUntouched();
    } else {
      // Marcar todos os campos do formulário como tocados para exibir mensagens de erro
      this.Form.markAllAsTouched();
      alert('Por favor, preencha todos os campos obrigatórios antes de prosseguir.');
    }
  }


  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep -= 1;
      localStorage.setItem('validarStep', this.currentStep.toString());
    }
  }

  // Verifica se uma etapa está acessível
  isStepAccessible(step: number): boolean {
    if (step === 2) {
      return this.validatePrimaryData();
    } else if (step === 3) {
      return this.validatePrimaryData() && this.validateSecondaryData();
    }
    return true;
  }

  goToStep(step: number): void {
    if (this.isStepAccessible(step)) {
      this.currentStep = step;
    }
  }








  openOccurrenceModal(): void {
    // Habilitar compartilhamento antes de abrir o modal
    this.expedienteService.enableSharing(true);
    this.expedienteService.disableSharing(false);

    // Abrir modal usando Bootstrap
    const modalElement = document.getElementById('modalEventoProcessos');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();

    const backdropElement = document.querySelector('.modal-backdrop');
    if (backdropElement) {
      backdropElement.classList.add('custom-modal-backdrop'); // Aplica o estilo
    }
    // Escutar o evento de fechamento do modal
    modalElement?.addEventListener('hidden.bs.modal', () => {
      // Desabilitar compartilhamento após o modal ser fechado
      this.expedienteService.enableSharing(false);
      this.expedienteService.disableSharing(true);

    });
  }

  FecharOccurrenceModal(): void {
    // Habilitar compartilhamento antes de abrir o modal
    this.expedienteService.enableSharing(false);

    // Abrir modal usando Bootstrap
    const modalElement = document.getElementById('modalEventoProcessos');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);

    modalInstance.hide();

    const backdropElement = document.querySelector('.modal-backdrop');
    if (backdropElement) {
      backdropElement.classList.remove('custom-modal-backdrop'); // Remove o estilo
    }

    // Escutar o evento de fechamento do modal
    modalElement?.addEventListener('hidden.bs.modal', () => {
      // Desabilitar compartilhamento após o modal ser fechado
      this.expedienteService.enableSharing(false);
    });
  }
  onOccurrenceSelected(occurrence: any): void {
    this.selectedOccurrence = occurrence;

    // Fechar o modal
    const modalElement = document.getElementById('modalEventoProcessos');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }
}
