import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '@core/services/config/Modal.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { SolicitacaoService } from '@resources/modules/pa/core/service/solicitacao.service';
import { TipoDocumentoService } from '@resources/modules/sigpq/core/service/config/Tipo-documento.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { fontFamily } from 'html2canvas/dist/types/css/property-descriptors/font-family';
import { Select2OptionData } from 'ng-select2';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pa-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css'],
})
export class RegistarOuEditarComponent implements OnInit, OnChanges {
  @Output() public onRegistarOuEditar: EventEmitter<any>;

  @Input() public pessoaId: any;
  @Input() public evento: any;
  private destroy$: Subject<void>


  public formatAccept = ['.pdf']

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '460px',
    minHeight: '460px',
    maxHeight: '460',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    toolbarHiddenButtons: [
      [

        'customClasses',
        'insertImage',
        'insertVideo',
        'toggleEditorMode'
      ]
    ],
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    toolbarPosition: 'top',
  };

  public mes: Array<Select2OptionData> = []
  public anos: Array<Select2OptionData> = []
  public modulos: Array<Select2OptionData> = []
  public direcaoOuOrgao: Array<Select2OptionData> = [];
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public simpleForm: any;
  public actualiza: boolean = false;
  public cacheId: any;
  public isLoading: boolean = false;
  public tipoDados: Array<Select2OptionData> = []
  public options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };



  constructor(
    private fb: FormBuilder,
    private agenteSolicitacaoService: SolicitacaoService,
    private modalService: ModalService,
    private utilService: UtilService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private tipoDocumentoService: TipoDocumentoService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
    
  ) {
    this.onRegistarOuEditar = new EventEmitter<any>();
    this.destroy$ = new Subject<void>()
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['evento'].currentValue != changes['evento'].previousValue) {
      this.setDefaultEvento();
    }
  }

  ngOnInit(): void {
    this.criarForm()
    this.buscarTipoDocumentos()
    this.buscarTipoEstruturaOrganica()
  }

  private buscarTipoEstruturaOrganica() {
    this.estruturaOrganicaServico.listar({})
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {

        this.tipoEstruturaOrganicas = response.map((item: any) => ({ id: item.sigla, text: item.name }))
      })
  }



  private buscarTipoDocumentos(): void {
    const opcoes = {}
    this.tipoDocumentoService.listarTodos(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.tipoDados = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })
  }

  public setNullSolicitaconota() {
    this.cacheId = null;
  }

  selecionarOrgaoOuComandoProvincial($event: any): void {

    if (!$event) return
    const opcoes = {
      tipo_estrutura_sigla: $event
    }
    this.direcaoOuOrgaoService.listarTodos(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.direcaoOuOrgao = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
      })

  }

  public reiniciarFormulario() {
    this.simpleForm?.reset();
    this.simpleForm?.controls?.documentos.controls?.forEach((item: any, index: number) => {
      this.remover(index)
    })

  }

  public limparTodoForm() {
    this.simpleForm.reset();
    this.simpleForm = null;
    this.onRegistarOuEditar.emit({ sucesso: true });
  }

  public reset() {
    this.reiniciarFormulario();
    this.simpleForm.patchValue({ pa_tipo_evento_id: this.getEvento?.id, pesssoafisica_id: this.getPessoaId, estado: ['E'] })

  }

  public get data(): string | Date {
    return this.utilService.dataActual;
  }

  public onSubmit() {

    if (!this.simpleForm.valid || this.isLoading) return


    this.isLoading = true
    const data = this.formData


    this.agenteSolicitacaoService.registar(data).pipe(
      finalize((): void => {
        this.isLoading = false;
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.actualiza = true;
        this.fecharModal()
        this.onRegistarOuEditar.emit({ sucesso: true })
        this.reiniciarFormulario()
      }
    })
  }
  private get formData(): FormData {
    const formData = new FormData();
    const controls = this.simpleForm.controls;


    formData.append('pa_tipo_evento_id', controls['pa_tipo_evento_id']?.value || '');
    formData.append('tipo_estrutura_sigla', controls['tipo_estrutura_sigla']?.value || '');
    formData.append('nota', controls['nota']?.value || '');
    formData.append('pessoajuridica_id', controls['pessoajuridica_id']?.value || '');
    formData.append('pessoafisica_id', controls['pessoafisica_id']?.value || '');
    formData.append('estado', controls['estado']?.value || '');
    formData.append('documentos', JSON.stringify(controls['documentos']?.value))
    const documentos = controls['documentos']?.value || [];
    documentos.forEach((doc: any, index: number) => {
      formData.append(`documento${index}`, doc.documento);
    });

    return formData;
  }


  private get getPessoaId() {
    return this.pessoaId as number;
  }

  public get getEvento() {
    return this.evento;
  }

  private setDefaultEvento() {
    this.criarForm();
    this.simpleForm.patchValue({
      pa_tipo_evento_id: this.getEvento?.id,
    });
  }

  private fecharModal() {
    this.modalService.fechar('close');
  }

  private criarForm() {
    this.simpleForm = this.fb.group({
      pa_tipo_evento_id: ['', Validators.required],
      nota: [null],
      pessoajuridica_id: ['', Validators.required],
      pessoafisica_id: [this.getPessoaId, Validators.required],
      estado: ["E", Validators.required],
      documentos: this.fb.array([]),
      tipo_estrutura_sigla: [null, Validators.required]
    })
  }

  public uploadFile(event: Event, index: number): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];


    const documentosArray = this.simpleForm.get('documentos') as FormArray;
    const documentoControl = documentosArray.at(index).get('documento');


    file && documentoControl?.setValue(file);
    documentosArray.updateValueAndValidity();


  }

  get formDocumento(): FormGroup {
    return this.fb.group({
      sigpq_tipo_documento_id: ['', Validators.required],
      documento: ['', Validators.required]
    })
  }


  public selecionarDocumento(event: any, index: number) {

    this.simpleForm.get('documentos').value[index].sigpq_tipo_documento_id = event;
    this.simpleForm.get('documentos').updateValueAndValidity()
  }

  public adicionarDocumento() {
    this.documentos.push(this.formDocumento);
  }

  public remover(index: number) {
    this.simpleForm.get('documentos').removeAt(index)
  }

  public get documentos(): FormArray {
    return this.simpleForm.get('documentos') as FormArray
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  
}
