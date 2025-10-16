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
import { CursoService } from '@core/services/config/Curso.service';

import { ModalService } from '@core/services/config/Modal.service';
import { Select2OptionData } from 'ng-select2';

import { finalize } from 'rxjs';
import { TipoDeFormacaoService } from '../../../../../../../core/services/config/TipoDeFormacao';

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



  simpleForm: FormGroup = new FormGroup({})
  isLoading: boolean = false


  public tipoCurso: Array<Select2OptionData> = []

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  };

  @Input() public curso: any = null
  @Output() eventRegistarOuEditModel!: EventEmitter<boolean>

  constructor(
    private fb: FormBuilder,
    private cursoService: TipoDeFormacaoService
  ) {


    this.eventRegistarOuEditModel = new EventEmitter<boolean>()
  }

  ngOnInit(): void {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['curso'].previousValue != changes['curso'].currentValue && this.curso != null) {
      this.preenchaCurso(this.curso)
    }
  }
  createForm() {
    this.simpleForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(4)]],
      sigla: ['', [Validators.required]],
      activo: [true],
      descricao: [''],
    });
  }

  preenchaCurso(data: any) {
    this.simpleForm.patchValue({
      nome: data.nome,
      sigla: data.sigla,
      activo: data.activo,
      descricao: data.descricao

    });
  }


  onSubmit() {

    if (this.simpleForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true

    const type = this.buscarId ? this.cursoService.editar(this.simpleForm.value, this.buscarId) : this.cursoService.registar(this.simpleForm.value)
    type.pipe(
      finalize(() => {
        this.isLoading = false
      })
    ).subscribe(() => {
      this.reiniciarFormulario()
      this.removeModal()
      this.eventRegistarOuEditModel.emit(true)
    })

  }


  private removeModal() {
    $(".modal").hide();
    $(".modal-backdrop").hide();
  }



  reiniciarFormulario() {
    this.simpleForm.reset()
  }

  get buscarId(): number {
    return this.curso?.id;
  }
}
