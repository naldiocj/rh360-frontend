import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProvinciaService } from '@core/services/Provincia.service';
import { ModalService } from '@core/services/config/Modal.service';
import { data } from 'jquery';
import { finalize } from 'rxjs';

@Component({
  selector: 'sigpq-registar-ou-editar-modal',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit, OnChanges {



  simpleForm: FormGroup = new FormGroup({})
  isLoading: boolean = false



  @Input() provincia!: any
  @Output() eventRegistarOuEditModel = new EventEmitter<boolean>()


  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private provinciaService: ProvinciaService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['provincia'].previousValue != changes['provincia'].currentValue) {
      this.preenchaForm(this.provincia)
    }
  }
  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.simpleForm = this.fb.group({
      sigla: [''],
      nome: ['', [Validators.required, Validators.minLength(4)]],
      descricao: [''],
      activo: [1],
    });
  }

  preenchaForm(data: any) {
   
    this.simpleForm.patchValue({
      sigla: data.sigla,
      nome: data.nome,
      descricao: data.descricao,
      activo: data.activo,
    });
  }

  onSubmit() {

    if (this.simpleForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true

    const type = this.buscarId ? this.provinciaService.editar(this.simpleForm.value, this.buscarId) : this.provinciaService.registar(this.simpleForm.value)

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

 get buscarId(): number {
    return this.provincia?.id;
  }

  ngOnDestroy(): void {
  }
}
