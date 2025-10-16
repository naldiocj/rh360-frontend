import { Component, EventEmitter, Input, Output } from '@angular/core';

import { finalize } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { Validators } from 'ngx-editor';

import { ModalService } from '@core/services/config/Modal.service';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { TipoDecisaoService } from '@resources/modules/sigpj/core/service/TipoDecisao.service';
import { DecisaoDisciplinarService } from '@resources/modules/sigpj/core/service/Decisao-disciplinar.service';

@Component({
  selector: 'sigpj-registar-ou-editar-decisao-model',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})

export class RegistarOuEditarDecisaoComponent {

  @Input() disciplinarId: any = null
  @Output() eventRegistarOuEditDisciplinarModel = new EventEmitter<boolean>()

  decisaoForm: any = null
  isLoading: boolean = false;

  arrayFiles!: File[]

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  public tipoDecisao: Array<Select2OptionData> = [];

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private formatarDataHelper: FormatarDataHelper,
    private tipoDecisaoService: TipoDecisaoService,
    private decisaoDisciplinarService: DecisaoDisciplinarService) {
    this.createForm()
    this.buscarDecisao()
  }

  createForm() {
    this.decisaoForm = this.fb.group({
      id: [''],
      transcricao: ['', [Validators.required]],
      data_decisao: ['', [Validators.required]],
      tipo_decisao_id: ['', this.disciplinarId],
      numero_oficio: ['', [Validators.required]],
      // numero_processo: ['', [Validators.required]],
      numero_despacho: ['', [Validators.required]],
      disciplinar_id: ['', this.disciplinarId]
    })
  }

  get dataActual() {
    return this.formatarDataHelper.formatDate(new Date())
  }

  buscarDecisao() {
    const options = {
      tipo: 'DISCIPLINAR'
    };
    this.tipoDecisaoService
      .listarTodos(options)
      .pipe(finalize(() => { }))
      .subscribe((response: any) => {
        this.tipoDecisao = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
          sigla: item.sigla,
        }));
      });
  }

  arquivosParecer(event: any) {
    this.arrayFiles = event.target.files
  }

  registar() {

    if (this.isLoading) {
      return
    }

    this.decisaoForm.value.disciplinar_id = this.disciplinarId

    const formData = new FormData()

    if (this.arrayFiles.length == 0) {
      formData.append('files[]', '');
    }

    for (let i = 0; i < this.arrayFiles.length; i++) {
      const file = this.arrayFiles[i]
      formData.append('files[]', file);
    }

    formData.append('transcricao', this.decisaoForm.value.transcricao)
    formData.append('data_decisao', this.decisaoForm.value.data_decisao)
    formData.append('tipo_decisao_id', this.decisaoForm.value.tipo_decisao_id)
    // formData.append('numero_processo', this.decisaoForm.value.numero_processo)
    formData.append('numero_oficio', this.decisaoForm.value.numero_oficio)
    formData.append('numero_despacho', this.decisaoForm.value.numero_despacho)
    formData.append('disciplinar_id', `${this.disciplinarId}`)

    this.isLoading = true;
    this.decisaoDisciplinarService
      .registar(formData)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.eventRegistarOuEditDisciplinarModel.emit(true)
        this.decisaoForm.reset()
        this.modalService.fechar('close-modal-decisao')
      })
  }

}
