import { CommonModule } from '@angular/common';
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
import { UtilsHelper } from '@core/helper/utilsHelper';
import { ModalService } from '@core/services/config/Modal.service';
import { FuncionarioExcepcaoService } from '@resources/modules/sigpq/core/service/Funcionario-Excepcao.service';
import { finalize, Subject } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-remover-agente-excepto',
  templateUrl: './remover-agente-excepto.component.html',
  styleUrls: ['./remover-agente-excepto.component.css'],
})
export class RemoverAgenteExceptoComponent implements OnChanges, OnDestroy {
  @Input() public pessoaId: any;
  @Output() public onEliminar: EventEmitter<void>;
  public isLoading: boolean = false;
  public funcionarioEmTempo: any = null;
  private destroy$: Subject<void>;
  constructor(
    public utilsHelper: UtilsHelper,
    private funcionarioExceptoService: FuncionarioExcepcaoService,
    private modalService: ModalService
  ) {
    this.onEliminar = new EventEmitter<void>();
    this.destroy$ = new Subject<void>();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['pessoaId'].currentValue != changes['pessoaId'].previousValue &&
      this.pessoaId != null
    ) {
      this.buscarEmTempo();
    }
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
      .eliminar(this.getPessoaId)
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
    this.onEliminar.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
