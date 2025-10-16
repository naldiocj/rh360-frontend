import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-expediente-visualisar-ou-imprimir',
  templateUrl: './visualisar-ou-imprimir.component.html',
  styleUrls: ['./visualisar-ou-imprimir.component.css']
})
export class VisualisarOuImprimirComponent implements OnInit {
 @Input() selectedExpediente: any;
  constructor() { }

  ngOnInit(): void {
  }

  editorConfig = {
    height: 800,
    menubar: false, 
    toolbar: 'print',
    statusbar: false,
    setup: (editor: any) => {
      editor.on('init', () => {
        editor.getBody().setAttribute('contenteditable', 'false'); // 🔹 Remove edição
        editor.shortcuts.remove('newdocument');
         // Bloqueia atalhos indesejados
    editor.on('keydown', (event: any) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'n') {
        event.preventDefault();
      }
    });
      });
    }
  };
}
