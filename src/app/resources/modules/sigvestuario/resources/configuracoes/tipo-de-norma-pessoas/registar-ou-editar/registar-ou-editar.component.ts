import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, OnDestroy, EventEmitter } from '@angular/core';
import { TipoDeMeiosService } from '@resources/modules/sigvestuario/core/meios/tipo-de-meios.service';
import { TipoDeNormaPessoasService } from '@resources/modules/sigvestuario/core/normas/tipo-de-norma-pessoas.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '@core/services/config/Modal.service';
import { SecureService } from '@core/authentication/secure.service';
import { finalize, Subject } from 'rxjs';

@Component({
  selector: 'sigvest-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit, OnChanges, OnDestroy{
  @Input() plano: any;
  @Output() onSubmitTipoDeMeiosForm = new EventEmitter<Boolean>();
  public tipo_de_norma_pessoas_form!: FormGroup;
  destroy$ = new Subject<void>()

  get nome_utilizador() {
    return this.secure_service.getTokenValueDecode().user.nome_completo;
  }
  get plano_id() {
    return this.plano?.id;
  }

  constructor(
    private secure_service: SecureService,
    private tipo_de_norma_pessoas_Service: TipoDeNormaPessoasService,
    private modal_service: ModalService,
    private form_builder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.validarTipoDePlanoForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['plano'].currentValue != changes['plano'] && this.plano != null) {
      this.preencherTipoDePlanoForm();
    }
  }

  validarTipoDePlanoForm(): void {
    this.tipo_de_norma_pessoas_form = this.form_builder.group({
      nome: ['', Validators.required],
      descricao: null ?? 'Registado pelo Sistema...',
      //dias: [''],
    })
  }

  preencherTipoDePlanoForm(): void {
    console.table(this.plano);

    this.tipo_de_norma_pessoas_form.patchValue({
      nome: this.plano.nome,
      descricao: this.plano.descricao,
      //dias: this.plano.dias,
    });
  }

  public async onSubmit() {
    if (this.tipo_de_norma_pessoas_form.invalid) {
      return;
    }
    console.log('oi')

    const type = this.plano_id? this.tipo_de_norma_pessoas_Service.editar(this.plano_id, this.tipo_de_norma_pessoas_form.value) : this.tipo_de_norma_pessoas_Service.registar(this.tipo_de_norma_pessoas_form.value);
    await type.pipe(
      finalize(() => {})
    ).subscribe((response) => {
      this.reiniciarFormulario();
      this.removerModal();
      this.onSubmitTipoDeMeiosForm.emit(true);
      this.validarTipoDePlanoForm();
    })
  }

  public reiniciarFormulario() {
    this.tipo_de_norma_pessoas_form.reset();
    this.tipo_de_norma_pessoas_form.clearValidators();
    this.onSubmitTipoDeMeiosForm.emit(true);
  }

  public removerModal() {
    this.modal_service.fechar('btn-close-registar');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}