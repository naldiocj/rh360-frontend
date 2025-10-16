import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DiversoService } from '@resources/modules/sigpj/core/service/Diverso.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import { Editor } from 'ngx-editor';
 

@Component({
  selector: 'app-editor',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit {

  editor!: Editor
  html: string = ''


  templateForm!: FormGroup;
  ngOnInit(): void {
    this.templateForm = new FormGroup({
      textEditor: new FormControl(""),
    });

    this.editor = new Editor()
    this.setDefaultContent()

  }


  get textEditor() {
    return this.templateForm.get('textEditor')!
  }




  mostrarConteudo() {
    window.alert(this.templateForm.get('textEditor')!.value);
  }
  setDefaultContent() {

    const imagePath = '/assets/img/insignia.png';
    const defaultContent = `
    <div >
        <div class="header">
          <img src="${imagePath}" class="logo" alt="Imagem do cabeçalho" width="50px" height="50px">
          <p>República de Angola</p> 
        </div>

        <div class="body">
          <h1>Título</h1>
          <p>Conteúdo do corpo...</p>
        </div>

        <div class="footer">
          <p>Rodapé</p>
        </div>
    </div>
  `;

    this.html = defaultContent;
  }






  //src=""

}
