import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { TratamentoPropostaProvimentoService } from '@resources/modules/sigpq/core/service/Tratamento-propostaProvimento.service';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-registar-tratamento',
  templateUrl: './registar-tratamento.component.html',
  styleUrls: ['./registar-tratamento.component.css'],
})
export class RegistarTratamentoComponent implements OnChanges {
  public simpleForm: any;
  agentesSelecionados: any = [];

  private destroy$ = new Subject<void>();

  @Input() public proposta: any;
  @Output() public onTratamento: EventEmitter<any>;
  public paraRepresentante: boolean = false;
  public id: any;
  public validarDataAdesao = this.formatarDataHelper.getPreviousDate(
    0,
    0,
    0,
    'yyyy-MM-dd'
  );

  public submitted: boolean = false;

  public carregando: boolean = false;
  constructor(
    private fb: FormBuilder,
    private tratamentoService: TratamentoPropostaProvimentoService,
    private formatarDataHelper: FormatarDataHelper
  ) {
    this.onTratamento = new EventEmitter<any>();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['proposta'].currentValue != changes['proposta'].previousValue) {
      this.criarForm();
    }
  }

  private criarForm() {
    this.simpleForm = this.fb.group({
      estado: ['A', Validators.required],
      anexo: [null, Validators.required],
      data_despacho_nomeacao: [null, [Validators.required]],
      numero_despacho_nomeacao: [null, [Validators.required]],
      nota: [null, Validators.required],
      numero: [this.getNumeroGuia, Validators.required],
    });
  }

  public uploadFilePDF(evt: Event, key: string) {
    const { files } = evt.target as HTMLInputElement;

    const file: File | Blob = files?.item(0) as File;
    this.simpleForm.get(key)?.setValue(file);
    this.simpleForm.get(key)?.updateValueAndValidity();
  }

  public onSubmit(): void {
    if (this.simpleForm.invalid || this.carregando) this.carregando = true;

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

  private get getFormData():FormData {
    const data = new FormData();

    Object.entries(this.simpleForm.value).forEach(([key, value]) => {
      if (key != 'anexo' && value != undefined) {
        data.append(key, (value as string).toString());
      }
    });

    data.append('anexo', this.simpleForm.get('anexo')?.value);

    return data;
  }

  public get getId() {
    return this.id;
  }
  public get getNumeroGuia() {
    return this.proposta?.numero;
  }

  public cancelarEnvio(id: any) {
    alert(id);
  }

  public reiniciarFormulario() {
    this.simpleForm.reset();

    this.simpleForm.patchValue({
      numero_guia: this.getNumeroGuia,
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
