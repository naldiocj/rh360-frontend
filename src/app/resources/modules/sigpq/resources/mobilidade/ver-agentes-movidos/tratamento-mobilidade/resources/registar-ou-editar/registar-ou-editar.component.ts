import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TratamentoMobilidadeService } from '@resources/modules/sigpq/core/service/Tratamento-mobilidade.service';
import { Subject, finalize, takeUntil } from 'rxjs';

@Component({
  selector: "sigpq-tratamento-mobilidade",
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnChanges {
  public simpleForm: any;
  agentesSelecionados: any = [];

  private destroy$ = new Subject<void>();

  @Input() public mobilidade: any;
  @Output() public onTratamento: EventEmitter<any>;
  public paraRepresentante: boolean = false;
  public id: any;

  public submitted: boolean = false;

  public carregando: boolean = false;
  constructor(
    private fb: FormBuilder,
    private tratamentoService: TratamentoMobilidadeService
  ) {
    this.onTratamento = new EventEmitter<any>();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["mobilidade"].currentValue != changes["mobilidade"].previousValue) {

      this.criarForm()
    }

  }


  private criarForm() {
    console.log(this.getNumeroGuia)
    this.simpleForm = this.fb.group({
      estado: ['V', Validators.required],
      nota: [null, Validators.required],
      numero_guia: [this.getNumeroGuia, Validators.required],
    });

  }

  public onSubmit(): void {
    if (this.simpleForm.invalid || this.carregando)
      this.carregando = true;

    const data = this.getFormData;

    const type = this.getId
      ? this.tratamentoService.editar(this.getId, data)
      : this.tratamentoService.registar(data);

    type
      .pipe(
        takeUntil(this.destroy$),
        finalize((): void => {
          this.carregando = false;
        })
      )
      .subscribe({
        next: () => {
          this.reiniciarFormulario();
          this.removerModal();
          this.onTratamento.emit({ enviar: true });
        },
      });

  }

  private get getFormData() {
    const formData = new FormData();
    formData.append('nota', String(this.simpleForm.get('nota')?.value).trim());
    formData.append(
      'estado',
      String(this.simpleForm.get('estado')?.value).trim()
    );
    formData.append(
      'numero_guia',
      String(this.simpleForm.get('numero_guia')?.value).trim()
    );

    return formData;
  }

  public get getId() {
    return this.id;
  }
  public get getNumeroGuia() {
    return this.mobilidade?.numero_guia
  }

  public cancelarEnvio(id: any) {
    alert(id);
  }

  public reiniciarFormulario() {
    this.simpleForm.reset();

    this.simpleForm.patchValue({
      numero_guia: this.getNumeroGuia
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }
}