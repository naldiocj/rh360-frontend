import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileService } from '@resources/modules/pa/core/helper/file.service';
import { AgenteReclamationService } from '@resources/modules/pa/core/service/agente-reclamation.service';
import { AgenteService } from '@resources/modules/pa/core/service/agente.service';
import { OrgaoService } from '@resources/modules/sigpj/core/service/Orgao.service';
import { finalize } from 'rxjs';
import { MeuOrgaoService } from '../../../../core/service/meu-orgao.service';
import { FileHelper } from '@core/helper/file.helper';
import { Select2OptionData } from 'ng-select2';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { ModuloService } from '@core/services/config/Modulo.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-send-reclamation',
  templateUrl: './send-reclamation.component.html',
  styleUrls: ['./send-reclamation.component.css'],
})
export class SendReclamationComponent implements OnInit {
  // config = {
  //   base_url: '/tinymce',
  //   preffix: '.min',
  //   toolbar:
  //     ' blocks | fontsize | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist munlist outdent indent |',
  //   plugins: 'list image list',
  //   encoding: 'UTF-8',
  //   branding: false,
  //   menubar: false,
  //   statusbar: false,
  // };

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
  simpleForm: FormGroup = new FormGroup({});
  isLoading: boolean = false;

  public direcaoOuOrgao: Array<Select2OptionData> = [];
  public modulos: Array<Select2OptionData> = []



  public options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  orgao: any = [];
  constructor(
    private agenteService: AgenteService,
    private fileService: FileService,
    private fb: FormBuilder,
    private reclamation: AgenteReclamationService,
    private meuOrgaoService: MeuOrgaoService,
    private fileHelper: FileHelper,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private moduloService: ModuloService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.buscarOrgao();
    this.buscarModulo()
  }

  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: '', text: "Selecione uma opção" },
    { id: 'Comando Provincial', text: "Comando Provincial" },
    { id: 'Orgão', text: "Orgão Central" },
  ]

  private buscarModulo() {
    this.moduloService.listar({}).pipe(
      finalize((): void => {

      })
    ).subscribe({
      next: (response: any) => {
        this.modulos = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome }))
      }
    })
  }

  private buscarOrgao() {
    this.meuOrgaoService
      .listarUm(this.getPessoaId)
      .pipe()
      .subscribe({
        next: (response) => {
          this.orgao = response;
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }

  createForm() {
    this.simpleForm = this.fb.group({
      texto: ['', [Validators.required, Validators.minLength(10)]],
      estado: ['E'],
      documento_file: [null],
      pessoafisica_id: this.getPessoaId,
      modulo_id: ['', Validators.required],
      pessoajuridica_id: ['', Validators.required],
      tem_documento: [false],
      nome_arquivo:  [null],
      pode_baixar: [false],
    });
  }

  onSubmit() {

    this.isLoading = true;


    this.reclamation
      .registar(this.simpleForm.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.reiniciarFormulario();
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      });


  }

  public get getPessoaId() {
    return this.agenteService.id as number;
  }
  async onSelectFile(event: any) {
    const file: File | Blob | any = event.target.files.item(0);
    if (
      this.fileService.isPDF(file.type) &&
      this.fileService.isMaxSize(file.size)
    ) {
      this.simpleForm.patchValue({
        tem_documento: true,
        //nome_arquivo: file.name,
        documento_file: file,
        pode_baixar: false,

      })

      console.log(this.simpleForm.value)
    }
  }
  reiniciarFormulario() {
    this.simpleForm.reset();
  }

  selecionarOrgaoOuComandoProvincial($event: any): void {

    const opcoes = {
      tipo_orgao: $event
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
}
