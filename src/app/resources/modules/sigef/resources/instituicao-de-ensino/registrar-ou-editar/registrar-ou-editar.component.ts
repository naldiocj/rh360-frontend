import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CursoService } from '@core/services/config/Curso.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { InstituicoesService } from '@resources/modules/sigef/core/service/instituicoes.service';

import { Editor, Validators } from 'ngx-editor';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-registrar-ou-editar',
  templateUrl: './registrar-ou-editar.component.html',
  styleUrls: ['./registrar-ou-editar.component.css']
})
export class RegistrarOuEditarComponent implements OnInit {


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


  simpleForm!: FormGroup;
  filtro = {
    page: 1,
    perPage: 1,
    regime: 1,
    search: ''
  }



  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }

  @Input() id: any
  @Output() onSucesso: EventEmitter<any>

  constructor(
    private fb: FormBuilder,
    private instituicoesservice: InstituicoesService,
  ) { 
    this.onSucesso = new EventEmitter<any>()
    }

  ngOnInit(): void {
    this.createForm()
  }

  createForm(){
    this.simpleForm = this.fb.group({
      nome_da_escola: ['', [Validators.required]],
      sigla: ['', [Validators.required]],
      descricao: ['', [Validators.required]]
    })
  }

  onSubmit(): void {
    console.log(this.simpleForm.value)
    const type = this.getId ? this.instituicoesservice.actualizar(this.getId, this.simpleForm.value ): this.instituicoesservice.registar( this.simpleForm.value )
  
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
}