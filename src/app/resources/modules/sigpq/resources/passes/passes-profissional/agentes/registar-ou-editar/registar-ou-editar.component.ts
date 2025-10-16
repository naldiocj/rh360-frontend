import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { PassesProfissionalService } from '@resources/modules/sigpq/core/service/Passes-Profissional.service';
import { FuncionarioValidation } from '@resources/modules/sigpq/shared/validation/funcionario.validation';
import { Subject, finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'app-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit {

  @Output() eventRegistarOuEditModel = new EventEmitter<boolean>()
  @Input() agentesId: any

  private destroy$ = new Subject<void>();
  simpleForm: any
  isLoading: boolean = false
  submitted: boolean = false

  constructor(
    private formatarDataHelper: FormatarDataHelper,
    public funcValidacao: FuncionarioValidation,
    private activatedRoute: ActivatedRoute,
    private passeProfissional: PassesProfissionalService,
    private fb: FormBuilder,
  ) {
    this.createForm()
  }

  ngOnInit(): void {

  }

  public get getId() {
    return this.activatedRoute.snapshot.params["id"] as number
  }
  createForm() {
    this.simpleForm = this.fb.group({
      agentes: this.fb.array([]),
    })
  }

  onSubmit() {
    if (this.simpleForm.invalid || this.submitted) {
      return
    }

    this.submitted = true
    this.isLoading = true

    this.simpleForm.value.agentes = this.agentesId.map((agente: any) => agente)

    const form = this.getFormDados
    const type = this.getId 
    ? this.passeProfissional.editar(this.getId, this.simpleForm.value)
    : this.passeProfissional.registar(this.simpleForm.value)
    type
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false
          this.submitted = false
        })
      ).subscribe((response) => {
        this.restaurarFormulario()
        this.removerModal()
        this.eventRegistarOuEditModel.emit(true)
      })

  }

  private removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  private get getFormDados() {
    const dados = new FormData()


    dados.append('agentes', JSON.stringify(this.simpleForm.value?.agentes))



    return dados
  }

  restaurarFormulario() {
    this.simpleForm.value.agentes_id = []
    this.agentesId = []
    this.simpleForm.reset()

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
