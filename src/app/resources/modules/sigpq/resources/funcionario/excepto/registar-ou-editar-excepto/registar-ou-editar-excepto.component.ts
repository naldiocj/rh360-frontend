import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UtilsHelper } from '@core/helper/utilsHelper';
import { ModalService } from '@core/services/config/Modal.service';
import { FuncionarioExcepcaoService } from '@resources/modules/sigpq/core/service/Funcionario-Excepcao.service';
import { finalize, Subject } from 'rxjs';

@Component({
  selector: 'app-registar-ou-editar-excepto',
  templateUrl: './registar-ou-editar-excepto.component.html',
  styleUrls: ['./registar-ou-editar-excepto.component.css'],
})
export class RegistarOuEditarExceptoComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() public pessoaId: any;
  @Output() public onRegistar: EventEmitter<void>;
  public isLoading: boolean = false;
  public funcionarioEmTempo: any = null;
  private destroy$: Subject<void>;
  public simpleForm: any;
  constructor(
    public utilsHelper: UtilsHelper,
    private fb: FormBuilder,
    private funcionarioExceptoService: FuncionarioExcepcaoService,
    private modalService: ModalService
  ) {
    this.onRegistar = new EventEmitter<void>();
    this.destroy$ = new Subject<void>();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['pessoaId'].currentValue != changes['pessoaId'].previousValue &&
      this.pessoaId != null
    ) {
      this.buscarEmTempo();
      this.preenchaForm();
    }
  }

  private preenchaForm() {
    this.simpleForm.patchValue({
      sigpq_funcionario_id: this.getPessoaId,
    });
  }

  private criarFuncionario() {
    this.simpleForm = this.fb.group({
      sigpq_funcionario_id: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.criarFuncionario();
  }

  public capitalize(text: string) {
    return this.utilsHelper.capitalize(text);
  }

  private buscarEmTempo() {
    this.isLoading = true;
    this.funcionarioExceptoService
      .listarUmPorPessoa(this.getPessoaId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.funcionarioEmTempo = response;
          console.log(response);
        },
      });
  }

  public get getPessoaId(): number {
    return this.pessoaId as number;
  }
  public onSubmit() {
    this.isLoading = true;
    this.funcionarioExceptoService
      .registar(this.simpleForm.value)
      .pipe(
        finalize((): void => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.fecharTodos();
        },
      });
  }

  public fecharTodos() {
    this.modalService.fechar('btn-close-modal');
    this.simpleForm.reset();
    this.onRegistar.emit()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
