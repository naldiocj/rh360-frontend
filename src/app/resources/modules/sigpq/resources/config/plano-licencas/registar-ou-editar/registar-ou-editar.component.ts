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
import { PlanoLicencasService } from '../../../../core/service/PlanoLicencas.service';
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


  public tipoLicencas: Array<Select2OptionData> = []

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  };

  @Input() public cargo: any = null
  @Output() eventRegistarOuEditModel!: EventEmitter<boolean>
  public regimes: Array<Select2OptionData> = []

  constructor(
    private fb: FormBuilder,private planoLicencaService:PlanoLicencasService,
    private tipoLicenca:TipoLicencasService
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
      tipo_licenca_id: ['', [Validators.required]],
      dia_inicio: ['', [Validators.required]],
      dia_fim: ['', []],
      situacao: ['aberto', [Validators.required]],
      activo: [true],
      descricao: ['Criado pelo utilizador']
    });
    this.carregarTipoLicencas()
  }





  preenchaCurso(data: any) {
    this.carregarTipoLicencas()
    this.createForm();
    this.simpleForm.patchValue({
      nome: data.nome,
      tipo_licenca_id: data.tipo_licenca_id,
      activo: data.activo,
      dia_inicio: this.converterDataParaNormal(data.dia_inicio),
      dia_fim: this.converterDataParaNormal(data.dia_fim),
      descricao: data.descricao
    });
    console.log("FORMULARIO VALIDO:",this.simpleForm.valid)
    console.log("Formulario:",data)
  }

  converterDataParaNormal(data:string)
  {
    const diaFimDate = new Date(data);

// Formata a data como 'YYYY-MM-DD'
const formattedDate =
`${diaFimDate.getFullYear()}-${(diaFimDate.getMonth() + 1).toString().padStart(2, '0')}-${diaFimDate.getDate().toString().padStart(2, '0')}`;
return formattedDate
}


  onSubmit() {

    if (this.simpleForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true

    const formData = { ...this.simpleForm.value, nome: this.simpleForm.value.nome.toUpperCase(),data_inicio:this.convertDataParaValida(this.simpleForm.value.data_inicio),data_fim:this.convertDataParaValida(this.simpleForm.value.data_fim)};

    const type = this.buscarId ? this.planoLicencaService.editar(formData, this.buscarId) : this.planoLicencaService.registar(formData)
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

  carregarTipoLicencas()
  {
   const filtros={

   }
    this.tipoLicenca.listar(filtros).pipe(

    ).subscribe((response:any)=>{
      this.tipoLicencas = []

        const org = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome }))
        this.tipoLicencas.push(...org)
    }),
    (error:any)=>{
      console.log("Erro ao carregar tipo de Licencas")
    }
  }

  convertDataParaValida(data:string)
  {
    //const dataReformada=new Date(data).toISOString().split("T")[0]
    console.log("Data selecionada:",data)
    return data
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
