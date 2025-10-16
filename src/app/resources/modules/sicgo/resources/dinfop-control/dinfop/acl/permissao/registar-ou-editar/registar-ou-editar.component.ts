import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalService } from '@core/services/config/Modal.service';
import { PermissaoService } from '@core/services/config/Permissao.service';
import { Subject, finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'app-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit, OnChanges, OnDestroy {

  public simpleForm: any
  public isLoading: boolean = false;
  public destroy$ = new Subject<void>
  @Input() permissao: any = null
  @Output() onEditar: EventEmitter<void>
  constructor(private fb: FormBuilder, private permissaoService: PermissaoService, private modalService: ModalService) {
    this.onEditar = new EventEmitter<void>()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['permissao'].currentValue != changes['permissao'].previousValue && this.permissao != null) {
      this.preenchaForm()
    }
  }

  ngOnInit(): void {
    this.criarForm()
  }

  private criarForm() {
    this.simpleForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(8)]],
      descricao: ['']
    })
  }


  private preenchaForm() {
    this.simpleForm.patchValue({
      nome: this.permissao.nome,
      descricao: this.permissao?.descricao
    })
  }

  public reiniciarFormulario() {
    this.simpleForm.reset()
    this.onEditar.emit()
  }

  public onSubmit() {

    if (!this.simpleForm.valid || this.isLoading) return
    this.isLoading = true;

    this.permissaoService
      .editar(this.simpleForm.value, this.buscarId)
      .pipe(
        takeUntil(this.destroy$),
        finalize((): void => {
          this.isLoading = false;
        })
      ).subscribe((): void => {
        this.reiniciarFormulario()
        this.fecharModal()
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }


  public fecharModal() {
    this.modalService.fechar('btn-close-modal')
  }

  public get buscarId() {
    return this.permissao?.id
  }
}
