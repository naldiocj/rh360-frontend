import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { ModalService } from '@core/services/config/Modal.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FileService } from '@resources/modules/pa/core/helper/file.service';
import { TratamentoPdfSolicitacaoService } from '@resources/modules/pa/core/service/tratamento-pdf-solicitacao.service';
import { TratarSolicitacaoService } from '@resources/modules/pa/core/service/tratar-solicitacao.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-pa-pendente',
  templateUrl: './pendente.component.html',
  styleUrls: ['./pendente.component.css']
})
export class PendenteComponent implements OnInit {

  @Input() solicitacao: any;
  @Input() pessoaId: any;
  @Input() solicitacao_id: any;
  @Input() evento_id: any;

  @Output() onTratamento!: EventEmitter<any>




  public carregando: boolean = false;
  public isPersonalizado: boolean = true;

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

  public simpleForm: any;
  public relatorioForm: any
  public previewFile: any
  constructor(
    private fb: FormBuilder,
    private tratarSolicitacaoService: TratarSolicitacaoService,
    private modalService: ModalService,
    private fileService: FileService,
    private ficheiroService: FicheiroService,
    private tratamentoPdfService: TratamentoPdfSolicitacaoService
  ) {

    this.onTratamento = new EventEmitter<any>()
  }

  ngOnChanges(changes: SimpleChanges): void { }

  ngOnInit(): void {
    this.criarForm();
  }

  public criarForm() {
    this.simpleForm = this.fb.group({
      documento: ['', Validators.compose([Validators.required])],
      tipo: ['', Validators.compose([Validators.required])],
      pessoafisica_id: this.getPessoaId,
      solicitacao_id: this.getSolicitacaoId,
      temArquivo: [true],
      conteudo: ['']
    });
    this.relatorioForm = this.fb.group({
      conteudo: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      documento: [''],
      tipo: [''],
      temArquivo: [false],
      pessoafisica_id: this.getPessoaId,
      solicitacao_id: this.getSolicitacaoId,
    })
  }

  private get getPessoaId(): number | null {
    return this.pessoaId;
  }

  private get getSolicitacaoId(): number | null {
    return this.solicitacao_id;
  }

  public handlerFile(evt: any) {
    const file: File | Blob = evt.target.files.item(0)
    const type = this.fileService.getTipoBlob(file)

    if (this.fileService.isPDF(file.type) && this.fileService.isMaxSize(file.size)) {
      this.previewFile = this.ficheiroService.createImageBlob(file)
      this.simpleForm.patchValue({
        documento: file,
        tipo: type
      })
    }
  }

  public resetForm() {
    this.simpleForm.reset()
    this.relatorioForm.reset()
    this.previewFile = null
  }
  public personalizado(value: boolean) {
    this.resetForm()
    this.simpleForm.patchValue({
      pessoafisica_id: this.getPessoaId,
      solicitacao_id: this.getSolicitacaoId,
      temArquivo: [!value]
    })
    this.isPersonalizado = value;

  }

  public onSubmit() {
    this.carregando = true;
    if (this.isPersonalizado) {
      this.tratamentoPdfService.registar(this.relatorioForm.value).pipe(
        finalize((): void => {
          this.carregando = false;
        })
      ).subscribe({
        next: (res: any) => {
          this.pendente(this.getSolicitacaoId)
        }, error: (err: any) => {
          console.error(err)
        }
      })

    } else {
      
      this.tratamentoPdfService.registar(this.simpleForm.value).pipe(
        finalize((): void => {
          this.carregando = false;
        })
      ).subscribe({
        next: (res: any) => {
          this.pendente(this.getSolicitacaoId)
        }, error: (err: any) => {
          console.error(err)
        }
      })
    }
  }

  private pendente(id: any) {
    this.carregando = false;
    this.tratarSolicitacaoService.pendente(id).pipe(
      finalize((): void => {
        this.carregando = false;
      })
    ).subscribe({
      next: (res: any) => {
        this.modalService.fechar('btn-close-pendente')
        this.onTratamento.emit({alterar: true})
        this.resetForm()
      }, error: (res: any) => {
        console.error(res)
      }
    })
  }

}
