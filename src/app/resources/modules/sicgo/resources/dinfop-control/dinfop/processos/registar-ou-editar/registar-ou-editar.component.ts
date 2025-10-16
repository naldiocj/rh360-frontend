import { Component, EventEmitter, ViewChild, ElementRef, Input, OnChanges, OnInit, Output, OnDestroy } from '@angular/core';
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
import { ListarOcorrenciaComponent } from '@resources/modules/sicgo/resources/piquete/listar/listar.component';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';


declare var bootstrap: any; // Para manipulação do modal Bootstrap

@Component({
  selector: 'sigop-registar-ou-editar-processos',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnChanges {
  process = { name: '', occurrenceId: null };
  selectedOccurrence: any;
 
 
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };



  @Input() public ocorrenciId: any;
  @Output() eventRegistarOuEditar = new EventEmitter<void>();

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
  delitouso: any;

  //kv

  photos: { side: string, dataUrl: string }[] = [];
  capturedImage: string | undefined;
  isFronteiraDisabled: boolean = true;

  public condicao: string | any;
  public pais: Array<Select2OptionData> = [];
  public provincia: Array<Select2OptionData> = [];
  public municipio: Array<Select2OptionData> = [];
  public estadocivil: Array<Select2OptionData> = [];
  public unidades: Array<Select2OptionData> = [];
  public distritos: Array<Select2OptionData> = [];
  public postos: Array<Select2OptionData> = [];
  cursos: any;
  tipoHabilitacaoLiterarias: any;


  constructor(
    private estadoCivilService: EstadoCivilService,
    private provinciaService: ProvinciaService,
    private paisService: PaisService,
    private ficheiroService: FicheiroService,
    private ocorrenciaService: OcorrenciaService,
    private router: Router,
    private cursoService: CursoService,
    private tipoHabilitacaoLiterariaService: TipoHabilitacaoLiterariaService,
    private municipioService: MunicipioService,
    private distritoService: DistritoService,
    private DinfopDelitousoService: DinfopDelitousoService,
    private fb: FormBuilder
  ) {
     
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }


  ngOnInit(): void {

    this.createForm();
    this.buscarProvincia();
    this.buscarMunicipio();
    this.buscarPais();
    this.buscarEstado();
    this.buscarProvincia();
    this.buscarTipoHabilitacaoLiteraria()
// Inicialmente desativa o campo "fronteira" caso necessário
this.Form.get('documentType')?.valueChanges.subscribe(value => {
  this.toggleFronteiraField(value);
});
 
    if (this.params?.getId || this.params?.getInfo) {
      this.createForm();

      if (this.params?.getId || this.params?.getInfo) {
        this.getDataForm();
      }
    }

 
    this.ocorrenciaService.currentOccurrence.subscribe((occurrence) => {
      this.selectedOccurrence = occurrence;
      this.process.occurrenceId = occurrence?.id;
    });
  }
 
  openOccurrenceModal(): void {
    // Habilitar compartilhamento antes de abrir o modal
    this.ocorrenciaService.enableSharing(true);
    this.ocorrenciaService.disableSharing(false);

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
      this.ocorrenciaService.enableSharing(false);
      this.ocorrenciaService.disableSharing(true);

    });
  }
  
  FecharOccurrenceModal(): void {
    // Habilitar compartilhamento antes de abrir o modal
    this.ocorrenciaService.enableSharing(false);

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
      this.ocorrenciaService.enableSharing(false);
    });
  }
  onOccurrenceSelected(occurrence: any): void {
    this.selectedOccurrence = occurrence;

    // Fechar o modal
    const modalElement = document.getElementById('modalEventoProcessos');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }
  
 // Função chamada ao mudar o tipo de documento
 onDocumentTypeChange(event: any) {
  const selectedDocument = event.target.value;
  this.toggleFronteiraField(selectedDocument);
}

// Função que habilita ou desabilita os campos com base no tipo de documento
toggleFronteiraField(documentType: string) {
  if (documentType === 'Passaporte') {
    this.isFronteiraDisabled = false;
    this.Form.get('fronteira')?.enable();
    this.Form.get('dataentrada_angola')?.enable();
  } else {
    this.isFronteiraDisabled = true;
    this.Form.get('fronteira')?.disable();
    this.Form.get('dataentrada_angola')?.disable();
  }
}





  ngOnChanges() {
    this.buscarProvincia();
    this.buscarMunicipio();
    this.buscarPais();
    this.buscarEstado();
    if (this.buscarId()) {
      this.getDataForm();
    }

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
            text: item.nome,
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

  public list = [
    { id: 1, value: 'Bilhete de Identidade', nome: 'Bilhete de Identidade', sigla: 'BI' },
    { id: 2, value: 'Passaporte', nome: 'Passaporte', sigla: 'PT' },
    { id: 3, value: 'Carta de condução', nome: 'Carta de condução', sigla: 'CDC' },
  ]

  altura: number = 150; // Valor inicial

  atualizarAltura(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.altura = Number(inputElement.value);
  }

  createForm() {
    this.Form = this.fb.group({
      nome: ['', [Validators.required]],
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
      sicgo_nacionalidade_id: ['', [Validators.required]],
      tipo_identidade: ['', [Validators.required]],
      numero_identidade: ['', [Validators.required]],
      dataEmissao: ['', [Validators.required, pastOrPresentDateValidator()]],
      localEmissao: ['', [Validators.required]],
      dataentrada_angola: [{ value: '', disabled: this.isFronteiraDisabled }],
      fronteira: [{ value: '', disabled: this.isFronteiraDisabled }],
      sicgo_ocorrencia_id: ['', [Validators.required]],
      //Caracteristica
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
    this.Form.patchValue({
      id: this.delitouso.id,
      nome: this.delitouso.nome,
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
      sicgo_nacionalidade_id: this.delitouso.sicgo_nacionalidade_id,
      tipo_identidade: this.delitouso.tipo_identidade,
      numero_identidade: this.delitouso.numero_identidade,
      dataEmissao: this.delitouso.dataEmissao,
      localEmissao: this.delitouso.localEmissao,
      dataentrada_angola: this.delitouso.dataentrada_angola,
      fronteira: this.delitouso.fronteira,
      sicgo_ocorrencia_id: this.delitouso.sicgo_ocorrencia_id,
      //CARACTERISTICAS
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

    console.log('D:', this.Form.value)

    if (this.Form && this.Form.valid|| this.isLoading) {
      Object.values(this.Form.controls).forEach(controls => {
        controls.markAsTouched();
      });
      console.log('Não Funcionando', this.Form.controls);

      console.log('Não Funcionando', this.Form.controls);
    } else {
      console.log('Funcionando', this.Form.value);
      this.isLoading = true;

      const type = this.buscarId()
        ? this.DinfopDelitousoService.editar(this.Form.value, this.buscarId())
        : this.DinfopDelitousoService.registar(this.Form.value);
      type.pipe(
        finalize(() => {
          this.isLoading = false;
          this.submitted = false;
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Sucesso:', response);
          this.removerModal();
          this.reiniciarFormulario();
          this.eventRegistarOuEditar.emit();
          // Exibir uma mensagem de sucesso ou redirecionar
        },
        error: (err) => {
          console.error('Erro ao registrar/editar:', err);
          this.formErrors = err; // Exibir a mensagem de erro na UI
        }
      });

    }
  }

  reiniciarFormulario() {
    this.Form.reset();
  }

  buscarId(): number {
    return this.delitouso?.id;
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


  public get getInfo(): number {
    return this.params?.getInfo as number
  }

  public get getId(): number {
    return this.params?.getId as number
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

  // Subtrai 12 anos e 89 anos da data de hoje
  minDate.setFullYear(today.getFullYear() - 89);
  maxDate.setFullYear(today.getFullYear() - 12);

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


  // Valida dados primários (Etapa 1)
  validatePrimaryData(): boolean {
    return !!this.Form.get('nome')?.valid &&
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
         !!this.Form.get('sicgo_nacionalidade_id')?.valid &&
         !!this.Form.get('tipo_identidade')?.valid &&
         !!this.Form.get('numero_identidade')?.valid &&
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






































  //QWERTY

}
