import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FicheiroService } from '@core/services/Ficheiro.service';

import { FuncionarioService } from '@core/services/Funcionario.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sigpq-perfil-modal-editar-foto',
  templateUrl: './modal-editar-foto.component.html',
  styleUrls: ['./modal-editar-foto.component.css']
})
export class ModalEditarFotoComponent implements OnInit {

  public formatAccept = ['.png', '.jpg', '.jpeg']
  @Input() pessoaId: any = 5
  @Input() foto_civil: any = null
  @Input() foto_efectivo: any = null
  @Output() eventEditFotoModel = new EventEmitter<boolean>()

  simpleForm: any;
  dadosProficionais: any

  isLoading: boolean = false
  submitted: boolean = false

  constructor(
    private funcionarioServico: FuncionarioService,
    private ficheiroService: FicheiroService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm()
    this.verFotoCivil()
    this.verFotoEfectivo()
  }

  createForm() {
    this.simpleForm = this.fb.group({
      funcionario_id: [null],
      foto_civil: [null],
      foto_efectivo: [null]
    })
  }

  uploadFile(event: any, campo: string): void {
    let file = event.target.files[0];
    this.simpleForm.get(campo).value = file;
    this.simpleForm.get(campo).updateValueAndValidity();
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  reiniciarFormulario() {
    this.simpleForm.reset()
  }

  verFotoCivil(): boolean | void {

    if (!this.foto_civil) return false

    
    const opcoes = {
      pessoaId: this.getId,
      url: this.foto_civil
    }

    this.isLoading = true;

    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((file) => {
        this.foto_civil = this.ficheiroService.createImageBlob(file);
    });

  }

  verFotoEfectivo(): boolean | void {

    if (!this.foto_efectivo) return false

    const opcoes = {
      pessoaId: this.getId,
      url: this.foto_efectivo
    }

    this.isLoading = true;

    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((file) => {
        this.foto_efectivo = this.ficheiroService.createImageBlob(file);
    });
  }

  public get getId() {
    return this.pessoaId as number
  }

  onSubmit() {

    if (this.simpleForm.invalid || this.submitted) {
      return
    }

    this.submitted = true
    this.isLoading = true

    this.simpleForm.get('funcionario_id').setValue(this.getId)

    this.funcionarioServico.alterarFoto(this.simpleForm).pipe(
      finalize(() => {
        this.isLoading = false
        this.submitted = false
      })
    ).subscribe(() => {
      this.reiniciarFormulario()
      this.removerModal()
      this.eventEditFotoModel.emit(true)
    })
  }

}
