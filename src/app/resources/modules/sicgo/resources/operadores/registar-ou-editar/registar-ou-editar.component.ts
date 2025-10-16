import { Component,OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';



@Component({
  selector: 'sigop-registar-ou-editar-operadores',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnChanges {

  grupoSuspeitoForm: FormGroup;
  formulariosRelacionadosArray: any[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.grupoSuspeitoForm = this.formBuilder.group({
      // ...
      formulariosRelacionados: new FormControl(''),
    });
  }

  adicionarFormularioRelacionado() {
    const novoFormulario = {
      titulo: 'Título do Formulário',
      codigo: 'Código do Formulário',
    };
    this.formulariosRelacionadosArray.push(novoFormulario);
  }

  removerFormularioRelacionado(index: number) {
    this.formulariosRelacionadosArray.splice(index, 1);
  }



  ngOnChanges():void{
     


  }









}
