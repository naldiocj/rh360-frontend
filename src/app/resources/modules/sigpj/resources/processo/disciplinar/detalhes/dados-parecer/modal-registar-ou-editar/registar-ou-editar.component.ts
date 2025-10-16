import { Component, EventEmitter, Input, Output } from '@angular/core';

import { finalize } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { Validators } from 'ngx-editor';
import { ParecerDisciplinarService } from '@resources/modules/sigpj/core/service/Parecer-disciplinar.service';
import { ModalService } from '@core/services/config/Modal.service';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';

@Component({
  selector: 'sigpj-registar-ou-editar-parecer-model',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})

export class RegistarOuEditarParedecerComponent {

  @Input() disciplinarId: any = null
  @Output() eventRegistarOuEditDisciplinarModel = new EventEmitter<boolean>()

  disciplinarForm: any = null
  isLoading: boolean = false;

  arrayFiles!: File[]

  constructor(private fb: FormBuilder,
    private modalService: ModalService,
    private formatarDataHelper:FormatarDataHelper,
    private parecerDisciplinarService: ParecerDisciplinarService) {
    this.createForm()
  }

  createForm() {
    this.disciplinarForm = this.fb.group({
      id: [''],
      assunto: ['', [Validators.required]],
      numero_processo: ['', [Validators.required]],
      numero_oficio: ['', [Validators.required]],
      data_parecer: ['', [Validators.required]],
      disciplinar_id: ['', this.disciplinarId]
    })
  }

  arquivosParecer(event: any) {
    this.arrayFiles = event.target.files
  }

  registar() {

    if (this.isLoading) {
      return
    }

    this.disciplinarForm.value.disciplinar_id = this.disciplinarId

    const formData = new FormData()

    for (let i = 0; i < this.arrayFiles.length; i++) {
      const file = this.arrayFiles[i]
      formData.append('files[]', file);
    }

    formData.append('disciplinar_id', `${this.disciplinarId}`)
    formData.append('assunto', this.disciplinarForm.value.assunto)
    formData.append('numero_processo', this.disciplinarForm.value.numero_processo)
    formData.append('numero_oficio', this.disciplinarForm.value.numero_oficio)
    formData.append('data_parecer', this.disciplinarForm.value.data_parecer)

    this.isLoading = true;
    this.parecerDisciplinarService
      .registar(formData)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.eventRegistarOuEditDisciplinarModel.emit(true)
        this.disciplinarForm.reset()
        this.modalService.fechar('close-modal')
      })
  }

  get dataActual() {
    return this.formatarDataHelper.formatDate(new Date())
  }
}
