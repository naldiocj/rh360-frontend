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
import { FeriadosService } from '../../../../core/service/config/Feriados.service';

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
  public licencas_aplicadas: Array<Select2OptionData> = [];


  public tipoCurso: Array<Select2OptionData> = []

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  };

  @Input() public cargo: any = null
  @Output() eventRegistarOuEditModel!: EventEmitter<boolean>
  public regimes: Array<Select2OptionData> = []

  constructor(
    private fb: FormBuilder,private feriadosService: FeriadosService,
  ) {


    this.eventRegistarOuEditModel = new EventEmitter<boolean>()
  }
  ngOnDestroy(): void {
    this.cargo=null
    this.createForm()
  }

  ngOnInit(): void {

    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cargo'].previousValue != changes['cargo'].currentValue && this.cargo != null) {
      this.preenchaCurso(this.cargo)
    }
  }
  createForm() {
    this.licencas_aplicadas.push({ id: '1', text: 'Considerado como um Feriado'})
    this.licencas_aplicadas.push({ id: '2', text: 'Considerado como Indisponível'})

    this.simpleForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(4)]],
      descricao: ['Criado automaticamente pelo utilizador', [Validators.required]],
      dia_selecionado: ['', [Validators.required]],
      activo: [true],
      observacoes: ['Explique para que serve este dia em poucas palavras', [Validators.required]],
      licenca_aplicada:['1',[Validators.required]]
    });

  }

  preenchaCurso(data: any) {
    const diaSelecionadoFormatado = new Date(data.dia_selecionado).toISOString().split('T')[0];
    this.simpleForm.patchValue({
      nome: data.nome,
      descricao: data.descricao,
      dia_selecionado: diaSelecionadoFormatado,
      activo: data.activo,
      observacoes:data.observacoes,
      licenca_aplicada:data.licenca_aplicada
    });
  }


  onSubmit() {
    if (this.simpleForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true

    const formData = { ...this.simpleForm.value, nome: this.simpleForm.value.nome.toUpperCase()};

    const type = this.buscarId ? this.feriadosService.editar(formData, this.buscarId) : this.feriadosService.registar(formData)
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
