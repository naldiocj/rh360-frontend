import { Component, Input, Output, OnChanges, EventEmitter, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { Observable, Subject, Subscriber, finalize } from 'rxjs';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { IziToastService } from '@core/services/IziToastService.service';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import { Ocorrencia } from '@resources/modules/sicgo/shared/model/ocorrencias.model';
import { pastOrPresentDateValidator } from '@shared/datavalidadorkv';
import Swal from 'sweetalert2';
import { SecureService } from '@core/authentication/secure.service';
import { VeiculoService } from '@resources/modules/sicgo/core/service/veiculos/veiculo.service';

@Component({
  selector: 'app-sicgo-veiculo',
  templateUrl: './registar-ou-editar-veiculo.component.html',
  styleUrls: ['./registar-ou-editar-veiculo.component.css']
})
export class RegistarOuEditarVeiculoComponent implements OnInit {

  // Array com as marcas e seus modelos
  marcas: Select2OptionData[] = [
    { id: 'Toyota', text: 'Toyota' },
    { id: 'Hyundai', text: 'Hyundai' },
    { id: 'Mercedes', text: 'Mercedes' },
    { id: 'Porsche', text: 'Porsche' },
    { id: 'Suzuki', text: 'Suzuki' },
    { id: 'Lexus', text: 'Lexus' },
    { id: 'Land-rover', text: 'Land-rover' },
    { id: 'Mazda', text: 'Mazda' },
    { id: 'SEAT', text: 'SEAT' },
    { id: 'Volkswagen', text: 'Volkswagen' },
    { id: 'Volvo', text: 'Volvo' },
    { id: 'Nissan', text: 'Nissan' },
    { id: 'Mitsubishi', text: 'Mitsubishi' }
  ];

  // Array de modelos disponíveis com base na marca selecionada
  modelosDisponiveis: Select2OptionData[] = [];

  // Formulário para veiculo

  selectedMarca: any;
  selectedModelo: any;



  options: any = {
    width: '100%',
    placeholder: 'Selecione uma opção',
    allowClear: true,
  };

  optionsMultiplo: any = {
    placeholder: "Selecione uma opção",
    width: '100%',
    multiple: true
  }

  ferridosV: number = 0; // Valor inicial

  atualizarFerridos(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.ferridosV = Number(inputElement.value);
  }

  mortesV: number = 0; // Valor inicial

  atualizarMortes(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.mortesV = Number(inputElement.value);
  }

  danosV: number = 0; // Valor inicial

  atualizarAltura(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.danosV = Number(inputElement.value);
  }
  occurrences: any[] = [];
  private apiUrl = 'https://nominatim.openstreetmap.org/search?format=json&q=';
  getTotal: any;
  getPercente: any;
  searchControl: any;
  provincia: string = ''; // Inicializado como vazio
  municipio: any;
  tipocrime: any;
  coordinates: any;
  @Input() ocorrencia: any = null;
  @Input() orgaoIdDoUsuarioLogado: any = 0;
  @Input() orgaoSigla: any;
  @Output() eventRegistarOuEditar = new EventEmitter<boolean>();
  @Input() ocorrenciaId: any = 0;

  isLoading: boolean = false;
  veiculoForm!: FormGroup;

  public objectoCrimeSelecionados: Array<any> = [];
  public pagination = new Pagination();
  public ocorrencias: any[] = [];


  matriculaValida: boolean = true;
  currentStep: number = 1;
  totalSteps: number = 4; // Defina o número total de passos aqui
  public fileUrlpiquete: any = null;
  public submitted: boolean = false;
  errorMessage: any;
  public validarData = this.formatarDataHelper.getPreviousDate(0, 0, 0, 'yyyy-MM-dd')


  constructor(
    private fb: FormBuilder,
    private ocorrenciaService: OcorrenciaService,
    private formatarDataHelper: FormatarDataHelper,
    private viatura: VeiculoService,
    private secureService: SecureService,
    private cdr: ChangeDetectorRef,
    private iziToast: IziToastService) {

    this.createForm();
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

   

  ngOnChanges() {


    if (this.buscarId()) {
      this.getDataForm();
    }

  }



  // Validador de matrícula Angolana
  // Validação da matrícula Angolana
  validarMatriculaAngolana(control: any) {
    const matricula = control.value;
    const regex = /^[A-Za-z]{2}\s\d{2}\s[A-Za-z]{2}$/; // Padrão ABCD 12 AB

    if (!matricula) {
      return null; // Se o campo estiver vazio, não é inválido
    }

    return regex.test(matricula) ? null : { matriculaInvalida: true };
  }

  // Simulação de validação
  verificarMatricula() {
    if (this.veiculoForm.valid) {
      // Simulando a verificação com um atraso de 2 segundos
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        // Exibir mensagem ou continuar com a lógica aqui
        alert('Matrícula válida!');
      }, 2000);
    } else {
      alert('Matrícula inválida! Verifique o formato.');
    }
  }

  // Função para atualizar os modelos de acordo com a marca selecionada
  onMarcaChange(): void {
    console.log('Marca Selecionada:', this.selectedMarca);

    // Limpar modelos antes de atualizar
    this.modelosDisponiveis = [];

    // Atualizar os modelos com base na marca selecionada
    this.atualizarModelos(this.selectedMarca);
  }

  // Função que mapeia os modelos baseados na marca selecionada
  atualizarModelos(marcaSelecionada: string): void {
    switch (marcaSelecionada) {
      case 'Toyota':
        this.modelosDisponiveis = ['Corolla', 'Hilux', 'Yaris'].map(modelo => ({ id: modelo, text: modelo }));
        break;
      case 'Hyundai':
        this.modelosDisponiveis = ['Elantra', 'Tucson', 'Creta'].map(modelo => ({ id: modelo, text: modelo }));
        break;
      case 'Mercedes':
        this.modelosDisponiveis = ['C-Class', 'E-Class', 'S-Class'].map(modelo => ({ id: modelo, text: modelo }));
        break;
      case 'Porsche':
        this.modelosDisponiveis = ['911', 'Cayenne', 'Macan'].map(modelo => ({ id: modelo, text: modelo }));
        break;
      case 'Suzuki':
        this.modelosDisponiveis = ['Swift', 'Vitara', 'Jimny'].map(modelo => ({ id: modelo, text: modelo }));
        break;
      case 'Lexus':
        this.modelosDisponiveis = ['RX', 'NX', 'IS'].map(modelo => ({ id: modelo, text: modelo }));
        break;
      case 'Land-rover':
        this.modelosDisponiveis = ['Defender', 'Discovery', 'Range Rover'].map(modelo => ({ id: modelo, text: modelo }));
        break;
      case 'Mazda':
        this.modelosDisponiveis = ['CX-5', 'Mazda3', 'Mazda6'].map(modelo => ({ id: modelo, text: modelo }));
        break;
      case 'SEAT':
        this.modelosDisponiveis = ['Ibiza', 'Leon', 'Ateca'].map(modelo => ({ id: modelo, text: modelo }));
        break;
      case 'Volkswagen':
        this.modelosDisponiveis = ['Golf', 'Passat', 'Tiguan'].map(modelo => ({ id: modelo, text: modelo }));
        break;
      case 'Volvo':
        this.modelosDisponiveis = ['XC60', 'XC90', 'S90'].map(modelo => ({ id: modelo, text: modelo }));
        break;
      case 'Nissan':
        this.modelosDisponiveis = ['Altima', '370Z', 'X-Trail'].map(modelo => ({ id: modelo, text: modelo }));
        break;
      case 'Mitsubishi':
        this.modelosDisponiveis = ['Outlander', 'Lancer', 'Pajero'].map(modelo => ({ id: modelo, text: modelo }));
        break;
      default:
        this.modelosDisponiveis = [];
    }

    console.log('Modelos Disponíveis:', this.modelosDisponiveis);
  }



  get nomeUtilizador() {
    return this.secureService.getTokenValueDecode().user.nome_completo
  }

  get orgao() {
    return this.secureService.getTokenValueDecode().orgao.sigla
  }
  get orgao_nome() {
    return this.secureService.getTokenValueDecode().orgao.nome_completo
  }
  get orgao_id() {
    return this.secureService.getTokenValueDecode().orgao.id
  }







  #fb = inject(FormBuilder);



  //Adição de VEICULOS
  // Getter para acessar o FormArray
  get veiculos() {
    return (this.veiculoForm.get('veiculos') as FormArray).controls;
  }

  public addVeiculo() {
    const itemVeiculo = this.#fb.group({
      matricula: [''],
      modelo: [''],
      marca: [''],
      cor: [''], 
      danos: [''],
    });

    return (this.veiculoForm.get('veiculos') as FormArray).push(itemVeiculo);
  }
  removeVeiculo(index: number): void {
    return (this.veiculoForm.get('veiculos') as FormArray).removeAt(index);
  }



  createForm() {
    this.veiculoForm = this.#fb.group({

      // Outros campos do formulário veiculos...
      veiculos: this.#fb.array([])
    });
  }


  getDataForm() {
    this.veiculoForm.patchValue({

      veiculos: this.#fb.array(this.ocorrencia.veiculos || []),
      // Adicionar outros campos conforme necessário
    });
  }



  onSubmit(): void {
    if (this.veiculoForm.invalid || this.isLoading) {
      this.markAllControlsAsTouched();
      console.error('Erro ao enviar o formulário:', this.veiculoForm.controls);
      return;
    }
  
    this.prepareAndSubmitForm();
  }
  
  private prepareAndSubmitForm(): void {
    const formData = this.createFormData();
    this.appendSicgoOcorrenciaId(formData);
  
    this.isLoading = true;
    this.submitted = true;
  
    const action = this.buscarId() ? this.viatura.editar(formData, this.buscarId()) : this.viatura.register(formData);
    const formDataEntries = Array.from((formData as any).entries());
    console.log('Payload enviado:', formDataEntries);
    
    // Ou com forEach
    formData.forEach((value, key) => {
      console.log(`Campo: ${key}, Valor: ${value}`);
    });
    
    action.pipe(finalize(() => this.resetLoadingState()))
          .subscribe({
            next: () => this.handleSuccess(),
            error: (err) => this.handleError(err),
          });
  }
  
  private appendSicgoOcorrenciaId(formData: FormData): void {
    const sicgoOcorrenciaId = this.getOcorrenciaId();
    if (sicgoOcorrenciaId) {
      formData.append('sicgo_ocorrencia_id', String(sicgoOcorrenciaId)); // String explícito
    }
  }
  

  private createFormData(): FormData {
    const formData = new FormData();
    this.appendFormValuesToFormData(formData);
    return formData;
  }

  private resetLoadingState(): void {
    this.isLoading = false;
    this.submitted = false;
  }

  private handleSuccess(): void {
    setTimeout(() => {
      window.location.reload();
    }, 700);
    this.removerModal();
    this.reiniciarFormulario();
    this.eventRegistarOuEditar.emit(true);
  }

  private handleError(err: any): void {
    this.errorMessage = err.error.message || 'Ocorreu um erro ao processar a solicitação.';
    console.error('Erro:', err);
  }




  markAllControlsAsTouched() {
    Object.values(this.veiculoForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }



  appendFormValuesToFormData(formData: FormData) {
    const formFields = [
      'veiculos',
      'sicgo_ocorrencia_id'
    ];

    formFields.forEach(field => {
      const value = this.veiculoForm.get(field)?.value;
      formData.append(field, value);
    });

    // Adicionando o sicgo_ocorrencia_id ao formData
    const sicgoOcorrenciaId = this.veiculoForm.value.sicgo_ocorrencia_id;
    if (sicgoOcorrenciaId) {
      formData.append('sicgo_ocorrencia_id', sicgoOcorrenciaId);
    }

    this.appendArrayToFormData('veiculos', formData);
  }
  appendArrayToFormData(arrayName: string, formData: FormData): void {
    const arrayControl = this.veiculoForm.get(arrayName) as FormArray;
    arrayControl.controls.forEach((control, index) => {
      const groupControl = control as FormGroup; // Casting para FormGroup
      Object.keys(groupControl.controls).forEach(key => {
        formData.append(`${arrayName}[${index}][${key}]`, groupControl.get(key)?.value);
      });
    });
  }




  reiniciarFormulario() {
    this.veiculoForm.reset();
    // this.ocorrencia = new Ocorrencia(); 
  }

  buscarId(): number {
    return this.ocorrencia?.id as number;
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }


  getOcorrenciaId(): number {
    return this.ocorrenciaId as number;
  }




  selectedItems: any[] = [];
  items = [
    { id: 1, name: 'Maculino' },
    { id: 2, name: 'Femenino' },
  ];
  isSelectHidden = true;





  // Valida dados secundários (Etapa 2)
  validateSecondaryData(): boolean {
    return !!this.veiculoForm.get('descricao')?.valid;
  }

  canSubmit(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.validateSecondaryData();

      default:
        return false;
    }
  }




}



