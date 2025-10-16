import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { ModalService } from '@core/services/config/Modal.service';

import { FuncionarioService } from '@core/services/Funcionario.service';
import { ArguidoDisciplinarService } from '@resources/modules/sigpj/core/service/ArguidoDisciplinar.service';
import { ParecerDisciplinarService } from '@resources/modules/sigpj/core/service/Parecer-disciplinar.service';
import { Validators } from 'ngx-editor';
import { finalize } from 'rxjs';

@Component({
  selector: 'sigpj-registar-ou-editar-parecer-peca-model',
  templateUrl: './registar-ou-editar-peca.component.html',
  styleUrls: ['./registar-ou-editar-peca.component.css']
})

export class RegistarOuEditarParedecerPecaComponent {

  @Input() disciplinarId: any = null
  @Output() eventRegistarOuEditDisciplinarModel = new EventEmitter<boolean>()

  isLoading: boolean = false;
  arrayFiles!: File[]

  disciplinarForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private parecerDisciplinarService: ParecerDisciplinarService) {
    this.createForm()
  }

  createForm() {
    this.disciplinarForm = this.fb.group({
      id: [''],
      anexo: [null, Validators.required],
      disciplinar_id: ['']
    });
  }

  arquivosParecer(event: any) {
    this.arrayFiles = event.target.files
  }

  registar() {

    if (this.isLoading) {
      return
    }

    const formData = new FormData();

    for (let i = 0; i < this.arrayFiles.length; i++) {
      const file = this.arrayFiles[i]
      formData.append('anexo[]', file);
    }

    formData.append('id', this.disciplinarForm.get('id')?.value);
    formData.append('disciplinar_id', this.disciplinarId);

    this.isLoading = true;

    this.parecerDisciplinarService
      .registarPeca(formData)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.eventRegistarOuEditDisciplinarModel.emit(true)
        this.disciplinarForm.reset()
        this.modalService.fechar('close-modal-adicionar-peca')
      })
  }

}
