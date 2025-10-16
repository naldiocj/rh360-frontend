import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CursosService } from '@resources/modules/sigef/core/service/cursos.service';
import { Pagination } from '@shared/models/pagination';
import { Editor, Validators } from 'ngx-editor';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css']
})
export class CursoComponent implements OnInit {



  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '300px',
    minHeight: '100px',
    maxHeight: '100',
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

  public totalBase: number = 0;
  public isLoading: boolean = false;
  public pagination = new Pagination();

  cursos: any = []

  simpleForm!: FormGroup

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: ''
  }

  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%'
  }

  @Input() id: any
  @Output() onSucesso: EventEmitter<any>

  constructor(
    private fb: FormBuilder,
    private cursosService: CursosService
  ) { 
    this.onSucesso = new EventEmitter<any>()
  }

  ngOnInit(): void {
    this.createForm();
    this.buscarCursos();
  }




  buscarCursos() {
    const options = { ...this.filtro };
    this.cursosService
      .listar(this.filtro)
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (response: any) => {
          this.cursos = response.data;
          console.log(response);

          this.totalBase = response.meta.current_page
            ? response.meta.current_page === 1
              ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;

          this.pagination = this.pagination.deserialize(response.meta);
        },
      });
  }

  createForm(){
    this.simpleForm = this.fb.group({
      curso_nome: ['', [Validators.required]],
      sigla: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
    })
  }


  onSubmit(): void {
    console.log(this.simpleForm.value)
    const type = this.getId
    ? this.cursosService.actualizar(this.getId, this.simpleForm.value)
    : this.cursosService.registar(this.simpleForm.value);
  
    type.pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      this.removerModal()
      this.resetForm()
      this.onSucesso.emit({registar: true})
    })
  }


  private resetForm(){
    this.simpleForm.reset()
  }

  get getId() {
    return this.id
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }


  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarCursos();
  }
}