import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HabilitacoesService } from '@resources/modules/sigef/core/service/habilitacoes.service';
import { Validators } from 'ngx-editor';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-registrar-ou-editar',
  templateUrl: './registrar-ou-editar.component.html',
  styleUrls: ['./registrar-ou-editar.component.css']
})
export class RegistrarOuEditarComponent implements OnInit {

  isLoading: boolean = false;
  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%'
  };

  @Input() id: any
  @Output() onSucesso: EventEmitter<any>

  simpleForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private habilitacoesService: HabilitacoesService
  ) { 
    this.onSucesso = new EventEmitter<any>()
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.simpleForm = this.fb.group({
      nome_completo: ['', [Validators.required]],
      NomeUtilizador: ['', [Validators.required]],
      email: ['', [Validators.required]],
      senha: ['', [Validators.required]],
      funcao: ['', [Validators.required]],
      instituicao: ['', [Validators.required]],

    })
  }


  onSubmit(){
    console.log(this.simpleForm.value)
  }


  private resetForm() {
    this.simpleForm.reset();
  }
  private get getId() {
    return this.id;
  }

}
