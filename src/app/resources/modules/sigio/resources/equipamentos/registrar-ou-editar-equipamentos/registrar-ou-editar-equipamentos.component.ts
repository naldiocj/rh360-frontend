import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Editor, Validators } from 'ngx-editor';

@Component({
  selector: 'app-registrar-ou-editar-equipamentos',
  templateUrl: './registrar-ou-editar-equipamentos.component.html',
  styleUrls: ['./registrar-ou-editar-equipamentos.component.css'],
})
export class RegistrarOuEditarEquipamentosComponent implements OnInit {

  simpleForm!: FormGroup
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
  
  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%'
  }


  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.crateForm();

  }

  crateForm(){
    this.simpleForm = this.fb.group({
      nome_equipamento: ['', [Validators.required]],
      tipo_equipamento: ['', [Validators.required]],
      sigla: ['', [Validators.required]],
      quantidade: ['', [Validators.required]],
      preco: ['', [Validators.required]],
      outros: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
    })
  }

  OnSubmit(){
    console.log(this.simpleForm)
  }


}

