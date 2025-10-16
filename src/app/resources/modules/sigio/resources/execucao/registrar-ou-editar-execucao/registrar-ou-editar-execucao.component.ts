import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Editor } from 'ngx-editor';
import { AngularEditorConfig } from '@kolkov/angular-editor'; 

@Component({
  selector: 'app-registrar-ou-editar-execucao',
  templateUrl: './registrar-ou-editar-execucao.component.html',
  styleUrls: ['./registrar-ou-editar-execucao.component.css'],
})
export class RegistrarOuEditarExecucaoComponent implements OnInit {


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
  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {

  }


}
