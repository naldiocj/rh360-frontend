import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { IziToastService } from '@core/services/IziToastService.service';
import { FileService } from '@resources/modules/pa/core/helper/file.service';
import { PaisService } from "@core/services/Pais.service"; 
import { Ocorrencia } from '@resources/modules/sicgo/shared/model/ocorrencias.model';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs'; 
import { ControloPrendidoService } from '@resources/modules/sicgo/core/config/ControloPrendido.service';
import { EnquadramentoLegalService } from '@resources/modules/sicgo/core/config/EnquandramentoLegal.service';
import { GravidadeService } from '@resources/modules/sicgo/core/config/Gravidade.service';
import { ImportanciaService } from '@resources/modules/sicgo/core/config/Importancia.service';
import { NivelSegurancaService } from '@resources/modules/sicgo/core/config/NivelSeguranca.service';
import { NominatimService } from '@resources/modules/sicgo/core/config/NominatimService.service';
import { ObjectoCrimeService } from '@resources/modules/sicgo/core/config/ObjectoCrime.service';
import { FamiliaCrimesService } from '@resources/modules/sicgo/core/config/TipicidadeOcorrencia.service';
import { TipoCategoriaService } from '@resources/modules/sicgo/core/config/TipoCategoria.service';
import { TipoCrimesService } from '@resources/modules/sicgo/core/config/TipoCrimes.service';
import { ZonaLocalidadeService } from '@resources/modules/sicgo/core/config/ZonaLocalidade.service';
import { VitimaService } from '@resources/modules/sicgo/core/service/piquete/vitima.service';

@Component({
  selector: 'app-vitima-modal',
  templateUrl: './vitima-modal.component.html',
  styleUrls: ['./vitima-modal.component.css']
})
export class VitimaModalComponent implements OnInit {
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };


  occurrences: any[] = [];
  private apiUrl = 'https://nominatim.openstreetmap.org/search?format=json&q=';
  getTotal: any;
  getPercente: any;
  searchControl: any;
  placeName: any;
  placeNameB: any;
  coordinates: any;
  public ocorrencia: any;
  public ocorrenciaVitima: any;
  @Input() ocorrenciaId: any;
  @Output() eventRegistarOuEditar = new EventEmitter<any>();

  isLoading: boolean = false;
  simpleForm!: FormGroup;
  public abrirCamera: boolean = false;
  public objectoCrimeSelecionados: Array<any> = [];
  public pagination = new Pagination();
  public ocorrencias: any[] = [];

  currentStep: number = 1;
  totalSteps: number = 4; // Defina o número total de passos aqui
  public submitted: boolean = false;

  public controloPrendidos: Array<Select2OptionData> = [];
  public enquadradamentoLegals: Array<Select2OptionData> = [];
  public gravidades: Array<Select2OptionData> = [];
  public importancias: Array<Select2OptionData> = [];
  public tipoOcorrencias: Array<Select2OptionData> = [];
  public nivelSegurancas: Array<Select2OptionData> = [];
  public objectoCrimes: any[] = []
  public zonaLocalidades: Array<Select2OptionData> = [];
  public tipoOcorrenciasClone: Array<Select2OptionData> = [];
  public tipoCategorias: Array<Select2OptionData> = [];
  public tipicidadeOcorrencias: Array<Select2OptionData> = [];
  public tipoCategoriasClone: Array<Select2OptionData> = [];
  public pais: Array<Select2OptionData> = [];
  errorMessage: any;
  public fileUrlCivil: any = null;


  constructor(
    private fb: FormBuilder,
    private vitimaService: VitimaService,
    private controloPrendidoService: ControloPrendidoService,
    private enquadramentoLegalService: EnquadramentoLegalService,
    private gravidadeService: GravidadeService,
    private ficheiroService: FicheiroService,
    private importanciaService: ImportanciaService,
    private tipoOcorrenciaService: TipoCrimesService,
    private tipoCategoriaService: TipoCategoriaService,
    private tipicidadeOcorrenciaService: FamiliaCrimesService,
    private nivelSegurancaService: NivelSegurancaService,
    private objectoCrimeService: ObjectoCrimeService,
    private zonaLocalidadeService: ZonaLocalidadeService,
    private fileService: FileService,
    private nominatimService: NominatimService,
    private paisService: PaisService,
    private iziToast: IziToastService) {

    this.createForm();
  }

  ngOnChanges() {
    this.buscarPais();
    this.buscarControloPrendido();
    this.buscarEnqudramentoLegal();
    this.buscarGravidades();
    this.buscarNivelSeguranca();
    this.buscarObjectoCrime();
    this.buscarImportancias();
    this.buscarZonaLocalidades();
    this.buscarTipicidadeOcorrencias();

    if (this.buscarId()) {
      this.getDataFormm();
    }


  }

  // Método para ir para o próximo passo
  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }

  }

  // Método para voltar ao passo anterior
  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  showStep(stepNumber: number): void {
    this.currentStep = stepNumber;
  }


  ngOnInit(): void {
    this.buscarPais();
    this.buscarControloPrendido();
    this.buscarEnqudramentoLegal();
    this.buscarGravidades();
    this.buscarNivelSeguranca();
    this.buscarObjectoCrime();
    this.buscarImportancias();
    this.buscarZonaLocalidades();
    this.buscarTipicidadeOcorrencias();
  }

  buscarTipicidadeOcorrencias() {
    this.tipicidadeOcorrenciaService
      .listarTodos({ page: 1, perPage: 10 })
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.tipicidadeOcorrencias = response.data.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }

  buscarControloPrendido() {
    const options = {};
    this.controloPrendidoService
      .listarTodos(options)
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

  buscarEnqudramentoLegal() {
    const options = {};
    this.enquadramentoLegalService
      .listarTodos(options)
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.enquadradamentoLegals = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }

  buscarNivelSeguranca() {
    const options = {};
    this.nivelSegurancaService
      .listarTodos(options)
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
    const options = {};
    this.objectoCrimeService
      .listarTodos(options)
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.objectoCrimes = response.map((item: any) => ({
            id: item.id,
            nome: item.nome,
            sigla: item.sigla,
          }));
          this.pagination = this.pagination.deserialize(response.meta);
        },
      });
  }

  buscarImportancias() {
    const options = {};
    this.importanciaService
      .listarTodos(options)
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

  private buscarPais() {
    const opcoes = {};
    this.paisService
      .listar(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (res: any) => {
          this.pais = res.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }

  private buscarGravidades() {
    this.gravidadeService.listarTodos({}).pipe().subscribe({
      next: (response: any) => {
        this.gravidades = response.map((item: any) => ({ id: item.id, text: item.nome }))
      }
    })
  }

  private buscarZonaLocalidades() {
    this.zonaLocalidadeService.listarTodos({}).pipe().subscribe({
      next: (response: any) => {
        this.zonaLocalidades = response.map((item: any) => ({ id: item.id, text: item.nome }))
      }
    })
  }

  public selecionarCategoriaOcorrencia($event: any) {
    if (!$event)
      return
    this.tipoCategoriasClone = this.tipoCategorias.filter((item: any) => item.id == $event)
    this.tipoCategoriaService.listarTodos({ sicgo_tipo_ocorrencia_id: $event }).pipe().subscribe({
      next: (response: any) => {
        this.tipoCategorias = response.map((item: any) => ({ id: item.id, text: item.nome }))

      }
    })
  }

  public selecionarTipoOcorrencia($event: any) {
    if (!$event)
      return

    this.tipoOcorrenciasClone = this.tipoOcorrencias.filter((item: any) => item.id == $event)
    this.tipoOcorrenciaService.listarTodos({ sicgo_tipo_ocorrencia_id: $event }).pipe().subscribe({
      next: (response: any) => {
        this.tipoOcorrencias = response.map((item: any) => ({ id: item.id, text: item.nome }))

      }
    })
  }

  public filtro = {
    search: '',
    perPage: 5,
    page: 1,
  }
 

  createForm() {
    const regexTelefone = /^9\d{8}$/;
    const regexNome = '^[A-Za-zÀ-ÖØ-öø-ÿ- ]*$';
    this.simpleForm = this.fb.group({
      nome: [null, [Validators.required, Validators.minLength(4), Validators.pattern(regexNome)]],
      data_nascimento: ['', [Validators.required]],
      residencia: ['', [Validators.required]],
      raca: ['', [Validators.required]],
      tipo_de_dano: ['', [Validators.required]],
      data_de_dano: ['', []],
      contacto: [null, Validators.pattern(regexTelefone)],
      genero: ['', [Validators.required]],
      tipo_doc: ['', [Validators.required]],
      local_de_trabalho: ['', [Validators.required]],
      alcunha: ['', [Validators.required]],
      caracteristica: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      pais_id: ['', [Validators.required]], 
      n_id: ['', [Validators.required]],
    });
  }


//carvalho addm
  getDataFormm() {
    this.simpleForm.patchValue({
      id: this.ocorrenciaVitima.id,
      titulo: this.ocorrenciaVitima.titulo,
      data_ocorrido:this.ocorrenciaVitima.data_ocorrido,
      nome_ocorrente: this.ocorrenciaVitima.nome_ocorrente,
      bi_n: this.ocorrenciaVitima.bi_n,
      endereco: this.ocorrenciaVitima.endereco,
      sicgo_importancia_id: this.ocorrenciaVitima.sicgo_importancia_id,
      sicgo_gravidade_id: this.ocorrenciaVitima.sicgo_gravidade_id,
      sicgo_enquadramento_legal_id: this.ocorrenciaVitima.sicgo_enquadramento_legal_id,
      sicgo_tipicidade_ocorrencia_id: this.ocorrenciaVitima.sicgo_tipicidade_ocorrencia_id,
      sicgo_tipo_ocorrencia_id: this.ocorrenciaVitima.sicgo_tipo_ocorrencia_id,
      sicgo_objecto_crimes_id: this.ocorrenciaVitima.sicgo_objecto_crimes_id,
      sicgo_tipo_categoria_id: this.ocorrenciaVitima.sicgo_tipo_categoria_id,
      sicgo_endereco_zona_id: this.ocorrenciaVitima.sicgo_endereco_zona_id,
      sicgo_controlo_prendido_id: this.ocorrenciaVitima.sicgo_controlo_prendido_id,
      sicgo_processo_id: this.ocorrenciaVitima.sicgo_processo_id,
      sicgo_nivel_seguranca_id: this.ocorrenciaVitima.sicgo_nivel_seguranca_id,
      descricao: this.ocorrenciaVitima.descricao,
    });
  }

  onSubmit() {
    if (this.simpleForm.invalid) {
      console.log('Formulário inválido:', this.simpleForm.controls);
      Object.entries(this.simpleForm.controls).forEach(([key, control]) => {
        if (control.invalid) {
          console.error(`Campo inválido: ${key}`, control.errors);
        }
      });
      return; // Não prosseguir se o formulário estiver inválido
    } else {
      this.isLoading = true;
      this.simpleForm.value.ocorrencia_id = this.getOcorrenciaId();
  
      console.log('Dados enviados:', this.simpleForm.value);
  
      const type = this.buscarId()
        ? this.vitimaService.editar(this.simpleForm.value, this.buscarId())
        : this.vitimaService.registar(this.simpleForm.value);
  
      type.pipe(
        finalize(() => {
          this.isLoading = false;
          this.submitted = false;
        })
      ).subscribe({
        next: (res) => {
          setTimeout(() => {
            window.location.reload();
          }, 700);
          this.removerModal();
          this.reiniciarFormulario();
          this.eventRegistarOuEditar.emit(true);
        },
        error: (err) => {
          console.error('Erro ao registrar:', err);
          this.errorMessage = err.error?.message || 'Erro desconhecido';
        }
      });
    }
  }
  reiniciarFormulario() {
    throw new Error('Method not implemented.');
  }
  
  
  getOcorrenciaId(): number {
    return this.ocorrenciaId as number;
  }
  buscarId(): number {
    return this.ocorrencia as number;
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }
 

  validarSelecionado(id: number): boolean {
    return !!this.objectoCrimeSelecionados.find(o => o.id === id);
  }

  selecionarAgenteParaMobilidade(item: any) {
    const conjuntoUnico = new Set(this.objectoCrimeSelecionados)
    const index = conjuntoUnico.has(item)
    if (!index) {
      conjuntoUnico.add(item);
    } else {
      conjuntoUnico.delete(item);
    }
    this.objectoCrimeSelecionados = Array.from(conjuntoUnico);
  }





  get nomeValidate() {
    return (
      this.simpleForm.get('nome')?.invalid && this.simpleForm.get('nome')?.touched
    );
  }
  get data_nascimentoValidate() {
    return (
      this.simpleForm.get('data_nascimento')?.invalid && this.simpleForm.get('data_nascimento')?.touched
    );
  }
  get nome_ocorrenteValidate() {
    return (
      this.simpleForm.get('nome_ocorrente')?.invalid && this.simpleForm.get('nome_ocorrente')?.touched
    );
  }
  get residenciaValidate() {
    return (
      this.simpleForm.get('residencia')?.invalid && this.simpleForm.get('residencia')?.touched
    );
  }
  get racaValidate() {
    return (
      this.simpleForm.get('raca')?.invalid && this.simpleForm.get('raca')?.touched
    );
  }
  get tipo_de_danoValidate() {
    return (
      this.simpleForm.get('tipo_de_dano')?.invalid && this.simpleForm.get('tipo_de_dano')?.touched
    );
  }
  get data_de_danoValidate() {
    return (
      this.simpleForm.get('data_de_dano')?.invalid && this.simpleForm.get('data_de_dano')?.touched
    );
  }
  get contactoValidate() {
    return (
      this.simpleForm.get('contacto')?.invalid && this.simpleForm.get('contacto')?.touched
    );
  }
  get generoValidate() {
    return (
      this.simpleForm.get('genero')?.invalid && this.simpleForm.get('genero')?.touched
    );
  }
  get tipo_idValidate() {
    return (
      this.simpleForm.get('tipo_id')?.invalid && this.simpleForm.get('tipo_id')?.touched
    );
  }
  get n_idValidate() {
    return (
      this.simpleForm.get('n_id')?.invalid && this.simpleForm.get('n_id')?.touched
    );
  }
  get local_de_trabalhoValidate() {
    return (
      this.simpleForm.get('local_de_trabalho')?.invalid && this.simpleForm.get('local_de_trabalho')?.touched
    );
  }
  get alcunhaValidate() {
    return (
      this.simpleForm.get('alcunha')?.invalid && this.simpleForm.get('alcunha')?.touched
    );
  }
  get caracteristicaValidate() {
    return (
      this.simpleForm.get('caracteristica')?.invalid && this.simpleForm.get('caracteristica')?.touched
    );
  }
  get descricaoValidate() {
    return (
      this.simpleForm.get('descricao')?.invalid && this.simpleForm.get('descricao')?.touched
    );
  }


  public isVitimaInterveniente() {

  }
  onTipoIntervenienteChange() {

  }
  isInformanteInterveniente() {

  }
  isTestemunhaInterveniente() {

  }


  // Camera ere
  capturedImage: string | undefined;


  public condicao: string | any;

  changeView(novaVisao: string) {
    this.condicao = novaVisao;
  }
}
