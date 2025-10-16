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
import { Select2OptionData } from 'ng-select2';

import { finalize } from 'rxjs';
import { RegimeService } from '../../../../../../../core/services/Regime.service';
import { TipoCargoService } from '../../../../core/service/Tipo-cargo.service';
import { TipoLicencasService } from '../../../../core/service/TipoLicencas.service';

@Component({
  selector: 'sigpq-funcao-registar-ou-editar-modal',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css'],
  styles: [
    ` /deep/ .ng-dropdown-panel .scroll-host {
          max-height: 120px  !important;
      }
  `]
})
export class RegistarOuEditarComponent implements OnInit,OnDestroy {

  simpleForm: FormGroup = new FormGroup({})
  isLoading: boolean = false


  public tipoCurso: Array<Select2OptionData> = []

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  };

  @Input() public cargo: any = null
  @Output() eventRegistarOuEditModel!: EventEmitter<boolean>
  public regimes: Array<Select2OptionData> = []

  constructor(
    private fb: FormBuilder,private tipoCargoService:TipoLicencasService,
  ) {
    this.eventRegistarOuEditModel = new EventEmitter<boolean>()
    this.createForm();
  }
  ngOnDestroy(): void {
    this.cargo=null
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['cargo'] &&
      changes['cargo'].previousValue !== changes['cargo'].currentValue &&
      this.cargo
    ) {
      this.preenchaCurso(this.cargo);
    }
  }

  createForm() {
    this.simpleForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(4)]],
      sigla: ['', [Validators.required]],
      dias_maximos: ['', [Validators.required]],
      exige_anexo: ['', []],
      limite_anual: ['', [Validators.required]],
      activo: [true],
      descricao: ['Criado pelo utilizador']
    });

  }



  preenchaCurso(data: any) {
    this.simpleForm.patchValue({
      nome: data.nome,
      sigla: data.sigla,
      activo: data.activo,
      exige_anexo: data.exige_anexo,
      limite_anual: data.limite_anual,
      descricao: data.descricao,
      dias_maximos:data.dias_maximos
    });
  }


  onSubmit() {

    if (this.simpleForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true

    const formData = { ...this.simpleForm.value, nome: this.simpleForm.value.nome.toUpperCase()};

    const type = this.buscarId ? this.tipoCargoService.editar(formData, this.buscarId) : this.tipoCargoService.registar(formData)
    type.pipe(
      finalize(() => {
        this.isLoading = false
      })
    ).subscribe((sucess:any) => {
       this.reiniciarFormulario()
      this.removeModal()
      this.eventRegistarOuEditModel.emit(true)
    }), (error:any) => {
      console.error("Erro ao processar o cadastro:", error);
    }

  }


  private removeModal() {
    $(".modal").hide();
    $(".modal-backdrop").hide();
  }

  reiniciarFormulario() {
    this.simpleForm.reset()
  }

  get buscarId(): number {
    return this.cargo?.id;
  }

}
