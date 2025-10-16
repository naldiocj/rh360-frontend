import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms'; 
import { HabilitacoesService } from '@resources/modules/sigef/core/service/habilitacoes.service';
import { TipoHabilitacoesService } from '@resources/modules/sigef/core/service/tipohabilitacoes.service';

import { finalize } from 'rxjs';

@Component({
  selector: 'app-regitrar-ou-editar',
  templateUrl: './regitrar-ou-editar.component.html',
  styleUrls: ['./regitrar-ou-editar.component.css']
})
export class RegitrarOuEditarComponent implements OnInit {
  
  simpleForm!: FormGroup;
  filtro = {
    page: 1,
    perPage: 1,
    regime: 1,
    search: ''
  }

  tipo_habilitacoes: any = []

  @Input() public id: any;
  @Output() public onSucesso!: EventEmitter<any>;

  isLoading: boolean = false;
  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  constructor(
    private fb: FormBuilder,
    private habilitacoesService: HabilitacoesService,
    private tipohabilitacoesService: TipoHabilitacoesService
  ) { }

  ngOnInit(): void {
    this.createForm()
    this.buscarHabilitacoes();
  }

  createForm(){
    this.simpleForm = this.fb.group({
      nome: ['', [Validators.required]],
      sigla: ['', [Validators.required]],
      tipo_habilitacaos_id: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    })
  }

  onSubmit(){
    const type = this.getId
    ? this.habilitacoesService.actualizar(this.getId, this.simpleForm.value)
    :  this.habilitacoesService.registar(this.simpleForm.value);

    type
    .pipe(
      finalize((): void => {
        this.isLoading = false;
      })
    )
    .subscribe({
      next: (res: any) => {
        this.resetForm();
        this.onSucesso.emit({ registar: true })
      }
    })
  }

  buscarHabilitacoes(){
    this.tipohabilitacoesService
    .listar({})
    .pipe(finalize((): void => {}))
    .subscribe({
      next: (res: any) => {
        this.tipo_habilitacoes = res.map((item: any) => ({
          id: item.id,
          text: item.nome
        }));
        console.log(this.tipo_habilitacoes)
      }
    })
  }

  private resetForm() {
    this.simpleForm.reset();
  }
  private get getId() {
    return this.id;
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }
}