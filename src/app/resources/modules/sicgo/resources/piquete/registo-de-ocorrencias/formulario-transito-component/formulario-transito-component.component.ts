import { Component, Input, Output, OnChanges, EventEmitter, inject, ChangeDetectorRef, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';

import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { Observable, Subject, Subscriber, finalize } from 'rxjs';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { IziToastService } from '@core/services/IziToastService.service';
import { ProvinciaService } from '@core/services/Provincia.service';
import { FileService } from '@resources/modules/pa/core/helper/file.service';
import { ControloPrendidoService } from '@resources/modules/sicgo/core/config/ControloPrendido.service';
import { DistritoService } from '@resources/modules/sicgo/core/config/Distrito.service';
import { EnquadramentoLegalService } from '@resources/modules/sicgo/core/config/EnquandramentoLegal.service';
import { GravidadeService } from '@resources/modules/sicgo/core/config/Gravidade.service';
import { ImportanciaService } from '@resources/modules/sicgo/core/config/Importancia.service';
import { MunicipioService } from '@resources/modules/sicgo/core/config/Municipio.service';
import { NivelSegurancaService } from '@resources/modules/sicgo/core/config/NivelSeguranca.service';
import { NominatimService } from '@resources/modules/sicgo/core/config/NominatimService.service';
import { ObjectoCrimeService } from '@resources/modules/sicgo/core/config/ObjectoCrime.service';
import { FamiliaCrimesService } from '@resources/modules/sicgo/core/config/TipicidadeOcorrencia.service';
import { TipoCategoriaService } from '@resources/modules/sicgo/core/config/TipoCategoria.service';
import { TipoLocalService } from '@resources/modules/sicgo/core/config/TipoLocal.service';
import { TipoCrimesService } from '@resources/modules/sicgo/core/config/TipoCrimes.service';
import { ZonaLocalidadeService } from '@resources/modules/sicgo/core/config/ZonaLocalidade.service';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import { Ocorrencia } from '@resources/modules/sicgo/shared/model/ocorrencias.model';
import { pastOrPresentDateValidator } from '@shared/datavalidadorkv';
import Swal from 'sweetalert2';
import { SecureService } from '@core/authentication/secure.service';
import { BiconsultaService, ConsultaResponse } from '@resources/modules/sicgo/core/service/piquete/dinfop/biconsulta/biconsulta.service';
import { MapaService } from '@resources/modules/sicgo/core/service/mapa/mapa.service';
import { AuthService } from '@core/authentication/auth.service';




@Component({
  selector: 'app-sicgo-formulario-transito',
  templateUrl: './formulario-transito-component.component.html',
  styleUrls: ['./formulario-transito-component.component.css']
})
export class FormularioTransitoComponentComponent implements OnChanges {
   @Input() currentStep!: number;
   @Output() stepChange = new EventEmitter<number>();
 changeStep(step: number) {
     this.stepChange.emit(step); // Emite o evento para o componente pai
   }
 


  @Input() ocorrencia: any = null;

  @Input() orgaoSigla: any;
  @Output() eventRegistarOuEditar = new EventEmitter<boolean>()
  @Input() ocorrenciaId: any = 0;
  @ViewChild('modalRegistarOuEditar') modalRef!: ElementRef; // Referência à modal

  options = { width: '100%', placeholder: 'Selecione uma opção', allowClear: true };
  optionsMultiplo = { placeholder: "Selecione uma opção", width: '100%', multiple: true };

  ferridosV: number = 0;
  mortesV: number = 0;
  danosV: number = 0;

  occurrences: any[] = [];
  getTotal: any;
  getPercente: any;
  searchControl: any;
  provincia: string = '';
  municipio: any;
  tipocrime: any;
  coordinates: any;

  isLoading: boolean = false;
  ocorrenciaForm!: FormGroup;

  public objectoCrimeSelecionados: Array<any> = [];
  public pagination = new Pagination();
  public ocorrencias: any[] = [];

  tiposInterveniente = [
    { value: 'anonima', label: 'DENÚNCIA ANÔNIMA' },
    { value: 'denucia-publica', label: 'DENÚNCIA PÚBLICA' },
    { value: 'oficial-operativo', label: 'OFICIAL OPERATIVO' },
    { value: 'subinformante', label: 'SUB-INFORMANTE' },
    { value: 'detido', label: 'DETIDO' },
    { value: 'acusado', label: 'ACUSADO' },
    { value: 'vitima', label: 'VÍTIMA' },
    { value: 'participante', label: 'PARTICIPANTE' },
    { value: 'testemunha', label: 'TESTEMUNHA' },
    { value: 'informante', label: 'INFORMANTE' },
    { value: 'lesado', label: 'LESADO' },
    { value: 'condutor', label: 'CONDUTOR' }
  ];

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

  modelosDisponiveis: Select2OptionData[] = [];
  selectedMarca: any;
  selectedModelo: any;


  totalSteps: number = 4;
  public fileUrlpiquete: any = null;
  public submitted: boolean = false;
  public Crimesobjecto: any;
  public locals: Array<Select2OptionData> = [];
  public tipolocals: Array<Select2OptionData> = [];
  public controloPrendidos: Array<Select2OptionData> = [];
  public enquadradamentoLegals: Array<Select2OptionData> = [];
  public gravidades: Array<Select2OptionData> = [];
  public importancias: Array<Select2OptionData> = [];
  public tipoOcorrencias: Array<Select2OptionData> = [];
  public nivelSegurancas: Array<Select2OptionData> = [];
  public objectoCrimes: any = []
  public zonaLocalidades: Array<Select2OptionData> = [];
  public tipoCategorias: Array<Select2OptionData> = [];
  errorMessage: any;
  public familiaCrimes: Array<Select2OptionData> = [];
  public tipoCategoriasClone: Array<Select2OptionData> = [];
  public provincias: Array<Select2OptionData> = [];
  public municipios: Array<Select2OptionData> = [];
  public distritos: Array<Select2OptionData> = [];
  public validarData = this.formatarDataHelper.getPreviousDate(0, 0, 0, 'yyyy-MM-dd');

  constructor(
    private fb: FormBuilder,
    private ocorrenciaService: OcorrenciaService,
    private formatarDataHelper: FormatarDataHelper,
    private gravidadeService: GravidadeService,
    private ficheiroService: FicheiroService,
    private importanciaService: ImportanciaService,
    private tipoCrimesService: TipoCrimesService,
    private tipoCategoriaService: TipoCategoriaService,
    private familiaCrimesService: FamiliaCrimesService,
    private nivelSegurancaService: NivelSegurancaService,
    private objectoCrimeService: ObjectoCrimeService,
    private zonaLocalidadeService: ZonaLocalidadeService,
    private provinciaService: ProvinciaService,
    private controloPrendidoService: ControloPrendidoService,
    private municipioService: MunicipioService,
    private distritoService: DistritoService,
    private tipolocal: TipoLocalService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private consultaService: BiconsultaService,
    private renderer: Renderer2,
    private shapeCoordinatesService: MapaService
  ) {
    this.createForm();
  }

  ngOnChanges() {

    if (this.buscarId()) {
      this.getDataForm();
    }
  }

  ngOnInit(): void {
    this.createForm();
    this.buscarObjectoCrime()
    this.buscarGravidades()
    this.buscarZonaLocalidades()
    this.buscarProvincia()
    this.buscarTipoLocal()
    this.buscarFamiliaCrimes()
    this.buscarImportancias()
    this.buscarNivelSeguranca()
    this.buscarControloPrendido()

    this.shapeCoordinatesService.shapes$.subscribe((data) => {
      console.log('Forma recebida:', data.type);
      console.log('Coordenadas:', data.coordinates);
      // if (data.type === 'círculo') {
      //   this.Swal.open('Círculo adicionado com sucesso!', 'Fechar', { duration: 3000 });
      // } else if (data.type === 'triângulo') {
      //   this.Swal.open('Triângulo adicionado com sucesso!', 'Fechar', { duration: 3000 });
      // }
      // Armazene o tipo e as coordenadas
      this.receivedCoordinates = data.coordinates;
      this.receivedType = data.type; // Armazene o tipo da forma
    });

  }

  public receivedCoordinates: any; // Para armazenar coordenadas do mapa.
  public receivedType: any; // Para armazenar coordenadas do mapa.





  get nomeUtilizador() {
    return this.authService.user.nome_completo;
  }

  get orgao() {
    return this.authService.orgao.sigla;
  }

  get orgao_id() {
    return this.authService.orgao.id;
  }

  get permissions() {
    return this.authService?.permissions || [];
  }

  get role() {
    return this.authService?.role?.name?.toString().toLowerCase();
  }

  isDTSerUser(): boolean {
    return this.orgao === 'DTSER';
  }



  hasPermission(permission: string): boolean {
    return this.authService?.permissions?.includes(permission) || false;
  }



  showStep(stepNumber: number): void {
    this.currentStep = stepNumber;
  }

  validarMatriculaAngolana(control: any) {
    const matricula = control.value;
    const regex = /^[A-Za-z]{2}\s\d{2}\s[A-Za-z]{2}$/;

    if (!matricula) {
      return null;
    }

    return regex.test(matricula) ? null : { matriculaInvalida: true };
  }

  verificarMatricula() {
    if (this.ocorrenciaForm.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        alert('Matrícula válida!');
      }, 2000);
    } else {
      alert('Matrícula inválida! Verifique o formato.');
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.ocorrenciaForm.get(controlName);
    return Boolean(control?.invalid && control?.touched);
  }



  onMarcaChange(): void {
    console.log('Marca Selecionada:', this.selectedMarca);
    this.modelosDisponiveis = [];
    this.atualizarModelos(this.selectedMarca);
  }

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

  buscarControloPrendido() {
    this.controloPrendidoService.listarTodos({})
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.controloPrendidos = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }

  buscarNivelSeguranca() {
    this.nivelSegurancaService.listarTodos({})
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.nivelSegurancas = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }

  buscarObjectoCrime() {
    this.objectoCrimeService.listarTodos({})
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.objectoCrimes = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
          this.pagination = this.pagination.deserialize(response.meta);
        },
      });
  }

  buscarImportancias() {
    this.importanciaService.listarTodos({})
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.importancias = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }

  private buscarGravidades() {
    this.gravidadeService.listarTodos({}).pipe().subscribe({
      next: (response: any) => {
        this.gravidades = response.map((item: any) => ({ id: item.id, text: item.nome }));
      }
    });
  }

  private buscarZonaLocalidades() {
    this.zonaLocalidadeService.listarTodos({}).pipe().subscribe({
      next: (response: any) => {
        this.zonaLocalidades = response.map((item: any) => ({ id: item.id, text: item.nome }));
      }
    });
  }

  buscarFamiliaCrimes(): void {
    this.familiaCrimesService.listarTodos({ page: 1, perPage: 7 })
      .pipe(finalize(() => console.log('Finalizada a busca por famílias de crimes.')))
      .subscribe({
        next: (response: any) => {
          this.familiaCrimes = response.data
            .filter((item: any) => item.orgaoId === this.orgao_id)
            .map(({ id, nome }: any) => ({ id, text: nome }));

          console.log('Erro ao buscar famílias de crimes:', this.familiaCrimes);

        },
        error: (error: any) => {
          console.error('Erro ao buscar famílias de crimes:', error);
        },
      });
  }

  public handlerTipocrime(evento: any): void {
    if (!evento) return;

    const sicgo_familia_crime_id = evento;
    console.log('Selecionado Família de Crime ID:', sicgo_familia_crime_id);

    this.tipoCrimesService.listar(sicgo_familia_crime_id)
      .pipe(finalize(() => console.log('Finalizada a busca por tipos de crimes.')))
      .subscribe({
        next: (response: any) => {
          this.tipoOcorrencias = [...response.map(({ id, nome }: any) => ({ id, text: nome }))];

          this.ocorrenciaForm.get('sicgo_tipo_crime_id')?.setValue(null);
          this.tipoCategorias = [];
          this.ocorrenciaForm.get('sicgo_tipicidade_crime_id')?.setValue(null);

          // Força o Angular a detectar a mudança
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Erro ao buscar tipos de crimes:', error);
        },
      });
  }

  public selecionarCategoriaCrime(evento: any): void {
    if (!evento) return;

    const sicgo_tipo_crime_id = evento;

    this.tipoCategoriaService.listarum(sicgo_tipo_crime_id).subscribe({
      next: (response: any) => {
        this.tipoCategorias = response.map(({ id, nome }: any) => ({ id, text: nome }));

        // Força o Angular a detectar a mudança
        this.cdr.detectChanges();

        // Resetar a seleção de tipicidade
        this.ocorrenciaForm.get('sicgo_tipicidade_crime_id')?.setValue(null);

      },
      error: (error: any) => {
        console.error('Erro ao buscar categorias de crime:', error);
      },
    });
  }



  buscarTipoLocal() {
    this.tipolocal.listarTodos({ page: 1, perPage: 18 })
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.tipolocals = response.data.filter((item: any) => item.orgaoId === this.orgao_id)
            .map((item: any) => ({
              id: item.id,
              text: item.nome,
            }));
        },
        error: (error: any) => {
          console.error('Erro ao buscar os locais:', error);
        },
      });
  }

  buscarProvincia(): void {
    this.provinciaService.listarTodos({ page: 1, perPage: 18 })
      .subscribe({
        next: (response: any) => {
          if (response && Array.isArray(response.data)) {
            this.provincias = response.data.map((item: any) => ({
              id: item.id,
              text: item.nome,
            }));

            const selectedProvincia = this.provincias.find((provincia) => provincia);
            this.provincia = selectedProvincia ? selectedProvincia.text : '';
            console.log('Província selecionada:', this.provincia);

            this.cdr.detectChanges();
          }
        },
      });
  }

  public handlerProvincias($event: any) {
    if (!$event) return;

    const opcoes = { provincia_id: $event };

    this.municipioService.listar(opcoes)
      .pipe(finalize((): void => { }))
      .subscribe((response: any): void => {
        this.municipios = response.map((item: any) => ({
          id: item.id,
          text: item.nome
        }));

        this.municipio = this.municipios.length > 0 ? this.municipios[0].text : '';
      });
  }

  public selecionarMunicipio($event: any) {
    if (!$event) return;

    this.distritoService.listarTodos({ municipio_id: $event }).pipe().subscribe((response: any): void => {
      this.distritos = response.map((item: any) => ({
        id: item.id,
        text: item.nome
      }));
    });
  }

  #fb = inject(FormBuilder);

  get participantes() {
    return (this.ocorrenciaForm.get('participantes') as FormArray).controls as FormGroup[];
  }

  public addParticipante() {
    const itemParticipante = this.#fb.group({
      nome: [''],
      genero: [''],
      tel: [''],
      sicgo_denucia: [''],
    });

    return (this.ocorrenciaForm.get('participantes') as FormArray).push(itemParticipante);
  }

  removeParticipante(index: number): void {
    return (this.ocorrenciaForm.get('participantes') as FormArray).removeAt(index);
  }

  get veiculos() {
    return (this.ocorrenciaForm.get('veiculos') as FormArray).controls as FormGroup[];
  }

  public addVeiculo() {
    const itemVeiculo = this.#fb.group({
      matricula: [''],
      modelo: [''],
      marca: [''],
      cor: [''],
      ferridos: [''],
      mortes: [''],
      danos: [''],
    });

    return (this.ocorrenciaForm.get('veiculos') as FormArray).push(itemVeiculo);
  }

  removeVeiculo(index: number): void {
    return (this.ocorrenciaForm.get('veiculos') as FormArray).removeAt(index);
  }

  createForm() {
    this.ocorrenciaForm = this.#fb.group({
      data_ocorrido: ['', [Validators.required, pastOrPresentDateValidator()]],
      sicgo_importancia_id: ['', [Validators.required]],
      sicgo_familia_crime_id: ['', [Validators.required]],
      sicgo_tipo_crime_id: ['', [Validators.required]],
      sicgo_objecto_crimes_id: [''],
      sicgo_tipicidade_crime_id: ['', [Validators.required]],
      sicgo_tipo_local_id: ['', [Validators.required]],
      local: ['', [Validators.required]],
      provincia_id: ['', [Validators.required]],
      municipio_id: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      participantes: this.#fb.array([]),
      veiculos: this.#fb.array([])
    });
  }

  getDataForm() {
    this.ocorrenciaForm.patchValue({
      id: this.ocorrencia.id,
      data_ocorrido: this.ocorrencia.data_ocorrido,
      sicgo_importancia_id: this.ocorrencia.sicgo_importancia_id,
      sicgo_familia_crime_id: this.ocorrencia.sicgo_familia_crime_id,
      sicgo_tipo_crime_id: this.ocorrencia.sicgo_tipo_crime_id,
      sicgo_objecto_crimes_id: this.ocorrencia.sicgo_objecto_crimes_id || '',
      sicgo_tipicidade_crime_id: this.ocorrencia.sicgo_tipicidade_crime_id,
      sicgo_tipo_local_id: this.ocorrencia.sicgo_tipo_local_id,
      local: this.ocorrencia.local,
      provincia_id: this.ocorrencia.provincia_id,
      municipio_id: this.ocorrencia.municipio_id || this.ocorrencia.provincia_id,
      descricao: this.ocorrencia.descricao,
      participantes: this.#fb.array(this.ocorrencia.participantes || []),
      veiculos: this.#fb.array(this.ocorrencia.veiculos || []),
    });
  }

  onShapeCoordinatesReceived(data: { type: string; coordinates: any }): void {
    console.log('Forma recebida:', data.type);
    console.log('Coordenadas:', data.coordinates);

    // Processar as coordenadas como necessário
  }


  onSubmit(): void {
    if (this.ocorrenciaForm.invalid || this.isLoading) {
      this.markAllControlsAsTouched();
      console.error('Erro ao enviar o formulário:', this.ocorrenciaForm.controls);
      return;
    }


    // Monte o objeto FormData com as coordenadas
    // Valide se recebeu as coordenadas
    if (!this.receivedCoordinates) {
      console.error('Nenhuma coordenada recebida!');
      alert('Por favor, selecione uma forma no mapa antes de enviar.');
      return;
    }

    // Monte o objeto com `type` e `coordinates`
    const formData = this.createFormData({
      type: this.receivedType,
      coordinates: this.receivedCoordinates,
    });


    this.isLoading = true;
    this.submitted = true;

    const action = this.buscarId()
      ? this.ocorrenciaService.editar(formData, this.buscarId())
      : this.ocorrenciaService.register(formData);

    action.pipe(finalize(() => this.resetLoadingState())).subscribe({
      next: () => this.handleSuccess(),
      error: (err) => this.handleError(err),
    });
  }

  private createFormData(data: { type: string; coordinates: any }): FormData {
    const formData = new FormData();

    this.appendFormValuesToFormData(formData); // Adiciona outros campos do formulário

    formData.append('orgao', this.orgao);
    formData.append('type', data.type); // Tipo da forma

    // Adiciona as coordenadas no formato correto
    formData.append(
      'coordinates',
      JSON.stringify(data.coordinates || {})
    );


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
    Object.values(this.ocorrenciaForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  appendFormValuesToFormData(formData: FormData) {
    const formFields = [
      'data_ocorrido',
      'sicgo_importancia_id',
      'sicgo_familia_crime_id',
      'sicgo_tipo_crime_id',
      'sicgo_objecto_crimes_id',
      'sicgo_tipicidade_crime_id',
      'sicgo_tipo_local_id',
      'local',
      'provincia_id',
      'municipio_id',
      'descricao',
      'veiculos',
      'participantes',
    ];

    formFields.forEach(field => {
      const value = this.ocorrenciaForm.get(field)?.value;
      formData.append(field, value);
    });

    this.appendArrayToFormData('participantes', formData);
    this.appendArrayToFormData('veiculos', formData);
  }

  appendArrayToFormData(arrayName: string, formData: FormData): void {
    const arrayControl = this.ocorrenciaForm.get(arrayName) as FormArray;
    arrayControl.controls.forEach((control, index) => {
      const groupControl = control as FormGroup;
      Object.keys(groupControl.controls).forEach(key => {
        formData.append(`${arrayName}[${index}][${key}]`, groupControl.get(key)?.value);
      });
    });
  }

  reiniciarFormulario() {
    this.ocorrenciaForm.reset();
  }

  buscarId(): number {
    return this.ocorrencia?.id as number;
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }





  selectedItems: any[] = [];
  items = [
    { id: 1, name: 'Maculino' },
    { id: 2, name: 'Femenino' },
  ];
  isSelectHidden = true;
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
  onSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOptions = Array.from(selectElement.selectedOptions) as HTMLOptionElement[];
    this.selectedItems = selectedOptions.map(option => {
      const itemId = Number(option.value);
      return this.items.find(item => item.id === itemId);
    });
  }
  toggleSelect() {
    this.isSelectHidden = !this.isSelectHidden;
  }
  validarSelecionado(id: number) {
    const numeroUmExiste = this.objectoCrimeSelecionados.find((o: any) => o.id == id);
    if (numeroUmExiste) return true;
    return false;
  }

  selecionarAgenteParaMobilidade(item: any) {
    const conjuntoUnico = new Set(this.objectoCrimeSelecionados);
    const index = conjuntoUnico.has(item);
    if (!index) {
      conjuntoUnico.add(item);
    } else {
      conjuntoUnico.delete(item);
    }
    this.objectoCrimeSelecionados = Array.from(conjuntoUnico);
  }

  get data_ocorridoValidate() {
    return (
      this.ocorrenciaForm.get('data_ocorrido')?.invalid && this.ocorrenciaForm.get('data_ocorrido')?.touched
    );
  }

  get sicgo_importancia_idValidate() {
    return (
      this.ocorrenciaForm.get('sicgo_importancia_id')?.invalid && this.ocorrenciaForm.get('sicgo_importancia_id')?.touched
    );
  }

  get sicgo_familia_crime_idValidate() {
    return (
      this.ocorrenciaForm.get('sicgo_familia_crime_id')?.invalid && this.ocorrenciaForm.get('sicgo_familia_crime_id')?.touched
    );
  }
  get sicgo_tipo_crime_idValidate() {
    return (
      this.ocorrenciaForm.get('sicgo_tipo_crime_id')?.invalid && this.ocorrenciaForm.get('sicgo_tipo_crime_id')?.touched
    );
  }

  get sicgo_tipicidade_crime_idValidate() {
    return (
      this.ocorrenciaForm.get('sicgo_tipicidade_crime_id')?.invalid && this.ocorrenciaForm.get('sicgo_tipicidade_crime_id')?.touched
    );
  }

  get local_Validate() {
    return (
      this.ocorrenciaForm.get('local')?.invalid && this.ocorrenciaForm.get('local')?.touched
    );
  }

  get sicgo_denucia_Validate() {
    return (
      this.ocorrenciaForm.get('sicgo_denucia')?.invalid && this.ocorrenciaForm.get('sicgo_denucia')?.touched
    );
  }

  get nome_Validate() {
    return (
      this.ocorrenciaForm.get('nome')?.invalid && this.ocorrenciaForm.get('nome')?.touched
    );
  }

  get genero_Validate() {
    return (
      this.ocorrenciaForm.get('genero')?.invalid && this.ocorrenciaForm.get('genero')?.touched
    );
  }

  get descricaoValidate() {
    return (
      this.ocorrenciaForm.get('descricao')?.invalid && this.ocorrenciaForm.get('descricao')?.touched
    );
  }

  // Função para fechar a modal
  async fecharModal() {
    const sair = await this.sairDaPagina();
    if (sair) {
      this.renderer.setStyle(this.modalRef.nativeElement, 'display', 'none'); // Oculta a modal
    }
  }

  sairDaPagina(): Promise<boolean> {
    return Swal.fire({
      title: "Atenção!",
      html: `Sr(a). <strong>${this.nomeUtilizador}</strong>, Você tem alterações não salvas. Tem certeza de que deseja sair?`,
      icon: "warning",
      showCancelButton: true, // Exibe o botão de cancelar
      confirmButtonText: "Sim, Sair!", // Texto do botão de confirmação
      cancelButtonText: "Cancelar", // Texto do botão de cancelar
      buttonsStyling: false, // Remove estilos padrão dos botões
      customClass: {
        confirmButton: "btn btn-primary px-2 mr-1", // Classe personalizada para o botão de confirmação
        cancelButton: "btn btn-danger ms-2 px-2", // Classe personalizada para o botão de cancelar
      },
    }).then((result) => {
      return result.isConfirmed; // Retorna true se o usuário confirmar
    });
  }

  getProgressPercent(): number {
    return (this.currentStep / 10) * 100;
  }

  getBirthdateValidation() {
    const today = new Date();
    const minDate = new Date();
    const maxDate = new Date();

    minDate.setFullYear(today.getFullYear() - 89);
    maxDate.setFullYear(today.getFullYear() - 12);

    const minDateString = minDate.toISOString().split('T')[0];
    const maxDateString = maxDate.toISOString().split('T')[0];

    return { min: minDateString, max: maxDateString };
  }

  getDateValidation() {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    return { max: todayString };
  }

  resultado: any;
  biNumber: string = '';

  public dados: ConsultaResponse | null = null;

  pesquisarDadosPessoaisForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    data_de_nascimento: ['2025-01-02', Validators.required],
    pai: ['', Validators.required],
    mae: ['', Validators.required],
    morada: ['', Validators.required],
    emitido_em: ['', Validators.required],
    type: ['', Validators.required],
  });

  consultar() {
    if (this.biNumber.trim() === '') {
      this.errorMessage = 'O número do Bilhete de Identidade não pode ser vazio.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.consultaService.consultarBI(this.biNumber).subscribe(
      (data) => {
        this.isLoading = false;
        this.pesquisarDadosPessoaisForm.patchValue({
          name: data.name,
          data_de_nascimento: data.data_de_nascimento,
          pai: data.pai,
          mae: data.mae,
          morada: data.morada,
          emitido_em: data.emitido_em,
        });
        console.log('Resposta da API:', data.name);
        this.resultado = data;
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = 'Erro ao consultar o Bilhete de Identidade. Tente novamente.';
        console.error('Erro na consulta:', error);
      }
    );
  }





  validateInterveniente(): boolean {
    const participantesValidos = this.ocorrenciaForm.get('participantes')?.valid || false;
    return participantesValidos;
  }

  validateVeiculo(): boolean { 
    const veiculosValidos = this.ocorrenciaForm.get('veiculos')?.valid;
    return !!veiculosValidos;
  }

  // Valida dados primários (Etapa 1)
  validatePrimaryData(): boolean {
    return !!this.ocorrenciaForm.get('sicgo_familia_crime_id')?.valid &&
      !!this.ocorrenciaForm.get('sicgo_tipo_crime_id')?.valid &&
      !!this.ocorrenciaForm.get('sicgo_tipicidade_crime_id')?.valid &&
      !!this.ocorrenciaForm.get('sicgo_importancia_id')?.valid &&
      !!this.ocorrenciaForm.get('sicgo_tipo_local_id')?.valid &&
      !!this.ocorrenciaForm.get('local')?.valid &&
      !!this.ocorrenciaForm.get('provincia_id')?.valid &&
      !!this.ocorrenciaForm.get('municipio_id')?.valid &&
      !!this.ocorrenciaForm.get('data_ocorrido')?.valid;
  }


  // Valida dados secundários (Etapa 2)
  validateSecondaryData(): boolean {
    return !!this.ocorrenciaForm.get('descricao')?.valid;
  }

  // Valida características (Etapa 3)
  validateCharacteristics(): boolean {
    return !!this.ocorrenciaForm.get('sicgo_objecto_crimes_id')?.valid;
  }




  canSubmit(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.validatePrimaryData();
      case 2:
        return this.validateVeiculo();
      case 3:
        return this.validateInterveniente();
      case 4:
        return this.validateSecondaryData();
      case 5:
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
      this.ocorrenciaForm.markAsUntouched();
    } else {
      // Marcar todos os campos do formulário como tocados para exibir mensagens de erro
      this.showValidationErrors(); // Exibe erros de validação
    }
  }



  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep -= 1;
      this.persistStep();
    }
  }

  // Verifica se uma etapa está acessível
  isStepAccessible(step: number): boolean {
    if (step === 2) {
      return this.validatePrimaryData();
    } else if (step === 3) {
      return this.validatePrimaryData() && this.validateSecondaryData() && this.validateVeiculo();
    }
    
    return true;
  }

  // isStepAccessible(step: number): boolean {
  //   const stepAccessibility = [
  //     () => true, // Step 1 sempre acessível
  //     () => this.validatePrimaryData(), // Step 2 acessível se Step 1 estiver válido
  //     () => this.validatePrimaryData() && this.validateInterveniente(), // Step 3 acessível se Step 1 e Step 2 estiverem válidos
  //     () => this.validatePrimaryData() && this.validateInterveniente() && this.validateSecondaryData() && this.validateCharacteristics()// Step 4 acessível se Step 1, Step 2 e Step 3 estiverem válidos
  //   ];

  //   return stepAccessibility[step]?.() || false;
  // }

  handleNavigation(option: any) {
    if (option.action) {
      option.action(); // Executa a ação associada à opção, se existir
    }
    this.goToStep(option.step); // Atualiza o currentStep
  }

  menuOptions = [
    {
      label: 'Dados Primários',
      step: 1,
      action: () => this.goToStep(1),
      roles: ['admin'], // Apenas admins
      permissions: ['ocorrencia-update'], // Precisa dessa permissão
      icon: 'fas fa-info-circle'
    },
    {
      label: 'Veiculos',
      step: 2,
      action: () => this.goToStep(2),
      roles: ['admin'], // Somente Admin pode ver
      icon: 'fas fa-users'
    },
    {
      label: 'Intervenientes',
      step: 3,
      action: () => this.goToStep(3),
      roles: ['admin'], // Somente Admin pode ver
      icon: 'fas fa-users'
    },
    {
      label: 'Descrição do Evento',
      step: 4,
      action: () => this.goToStep(4),
      roles: ['admin'], // Somente Admin pode ver
      icon: 'fas fa-clipboard'
    },
    {
      label: 'Meios',
      step: 5,
      action: () => this.goToStep(5),
      roles: ['admin'], // Somente Admin pode ver
      icon: 'fas fa-tools'
    },

  ];



  get filteredMenuOptions() {
    return this.menuOptions.filter(option => {
      // Filtra por função
      if (option.roles && !option.roles.includes(this.role)) {
        return false;
      }
      // Filtra por permissão (descomentar se necessário)
      if (option.permissions && !this.hasPermission('expediente-update')) {
        return false;
      }
      return true; // Inclui a opção se passou nos critérios
    });
  }


  goToStep(step: any): void {
    if (this.isStepAccessible(step)) {
      this.currentStep = step; // Navega para o passo solicitado
    } else {
      alert('Preencha os passos anteriores corretamente antes de prosseguir.'); // Feedback visual
    }
  }

  private persistStep(): void {
    localStorage.setItem('validarStep', this.currentStep.toString());
  }

  private showValidationErrors(): void {
    this.ocorrenciaForm.markAllAsTouched();
    alert('Por favor, preencha todos os campos obrigatórios antes de prosseguir.');
  }
}