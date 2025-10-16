import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';

import { ModalService } from '@core/services/config/Modal.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { UtilService } from '@resources/modules/sigpq/core/utils/util.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { TipoPessoajuridicaService } from '@shared/services/config/TipoPessoafisica.service';

import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'sigpq-registar-ou-editar-modal',
  templateUrl: './registar-ou-editar-modal.component.html',
  styleUrls: ['./registar-ou-editar-modal.component.css'],
  styles: [
    ` /deep/ .ng-dropdown-panel .scroll-host {
          max-height: 120px  !important;
      }
  `]
})
export class RegistarOuEditarModalComponent implements OnInit, OnChanges {

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  };

  simpleForm: any
  isLoading: boolean = false



  @Input() public direcaoOuOrgao: any = null
  @Output() eventRegistarOuEditModel = new EventEmitter<boolean>()

  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
    private utilService: UtilService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.buscarTipoEstruturaOrganica()

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['direcaoOuOrgao'].previousValue != changes['direcaoOuOrgao'].currentValue && this.direcaoOuOrgao != null) {
      this.preenchaForm()
    }
  }


  private preenchaForm() {
    console.log(this.direcaoOuOrgao)

    this.simpleForm.patchValue({
      sigla: this.direcaoOuOrgao.sigla,
      endereco: this.direcaoOuOrgao?.endereco,
      contacto: this.direcaoOuOrgao?.contacto,
      email_pessoal: this.direcaoOuOrgao?.email_pessoal,
      nome_completo: this.direcaoOuOrgao.nome_completo,
      tipo_estrutura_sigla: this.direcaoOuOrgao.tipo_estrutura_organica_sigla,
      pessoajuridica_id: [''],
      descricao: [''],
      activo: [1],
    });
  }

  createForm() {
    const regexTelefoneAlternativo = /^\d{8,15}$/;
    this.simpleForm = this.fb.group({
      sigla: ['', [Validators.required]],
      nome_completo: ['', [Validators.required, Validators.minLength(4)]],
      tipo_pessoajuridica_id: ['1'],
      endereco: [null, [Validators.required, Validators.minLength(1)]],
      email_pessoal: [null, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$')],
      contacto: [null, Validators.pattern(regexTelefoneAlternativo)],
      tipo_estrutura_sigla: ['', [Validators.required]],
      pessoajuridica_id: [''],
      descricao: [''],
      activo: [1],
    });
  }

  private buscarTipoEstruturaOrganica() {
    this.estruturaOrganicaServico.listar({})
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {

        this.tipoEstruturaOrganicas = response.map((item: any) => ({ id: item.sigla, text: item.name }))


      })
  }

  onSubmit() {

    if (this.simpleForm.invalid || this.isLoading) {
      this.utilService.validarCampo(this.simpleForm)
      return
    }

    this.isLoading = true

    const type = this.direcaoOuOrgao ?
      this.direcaoOuOrgaoService.editar(this.simpleForm.value, this.buscarId()) :
      this.direcaoOuOrgaoService.registar(this.simpleForm.value)

    type.pipe(
      finalize(() => {
        this.isLoading = false
      })
    ).subscribe(() => {
      this.reiniciarFormulario()
      this.modalService.fechar('close')
      this.eventRegistarOuEditModel.emit(true)
    })

  }

  reiniciarFormulario() {
    this.simpleForm.reset()
  }

  selecionarOrgaoOuComandoProvincial($event: any) {
    this.simpleForm.value.orgao_comando_provincial = $event
  }

  buscarId(): number {
    return this.direcaoOuOrgao?.id;
  }

  ngOnDestroy(): void {
  }
}
