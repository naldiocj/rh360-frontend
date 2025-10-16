import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CursosService } from '@resources/modules/sigef/core/service/cursos.service';
import { DisciplinasService } from '@resources/modules/sigef/core/service/disciplinas.service';
import { Pagination } from '@shared/models/pagination';
import { Editor, Validators } from 'ngx-editor';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-disciplina',
  templateUrl: './disciplina.component.html',
  styleUrls: ['./disciplina.component.css']
})
export class DisciplinaComponent implements OnInit {


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



  public pagination = new Pagination();
  simpleForm!: FormGroup
  disciplinas: any = []
  totalBase: number = 0

  cursos: any = []
  @Input() id: any
  @Output() onSucesso: EventEmitter<any>

  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%'
  }


  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: ''
  }

  constructor(
    private fb: FormBuilder,
    private cursosService: CursosService,
    private disciplinaService: DisciplinasService
  ) {
  this.onSucesso = new EventEmitter<any>()  
 }

  ngOnInit(): void {
    this.createForm();
    this.buscarCursos();
    this.buscarDisciplinas();
  }




  buscarDisciplinas() {
    const options = { ...this.filtro }
    this.disciplinaService
      .listar(options)
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (response: any) => {
          this.disciplinas = response.data;
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
      curso_id: ['', [Validators.required]],
      disciplina: ['', [Validators.required]],
      sigla: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
    })
  }


  buscarCursos(){
    this.cursosService
    .listar({})
    .pipe(finalize((): void => {} ))
    .subscribe({
      next: (responce: any) => {
        this.cursos = responce.map((item: any) => ({
          id: item.id,
          text: item.curso_nome
        }));
        console.log(this.cursos)
      }
    })
  }

  onSubmit(): void {
    console.log(this.simpleForm.value)
    const type = this.getId
    ? this.disciplinaService.actualizar(this.getId, this.simpleForm.value)
    : this.disciplinaService.registar(this.simpleForm.value);
  
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

  filtrarPagina (key: any, $e: any){
    if(key == 'page'){
      this.filtro.page = $e;
    }else if (key == 'perPage'){
      this.filtro.perPage = $e.target.value;
    }else if(key == 'search'){
      this.filtro.search = $e;
    }
  }

}
