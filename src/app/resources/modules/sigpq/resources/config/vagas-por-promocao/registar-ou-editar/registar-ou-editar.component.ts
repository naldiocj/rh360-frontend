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
import { VagaParaPromocaoService } from '../../../../core/service/VagaParaPromocao.service';
import { DirecaoOuOrgaoService } from '../../../../../../../shared/services/config/DirecaoOuOrgao.service';
import { PatenteService } from '../../../../../../../core/services/Patente.service';
import { TipoCarreiraOuCategoriaService } from '../../../../core/service/config/Tipo-carreira-ou-categoria.service';

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
  public tipoCarreiraOuCategorias: Array<Select2OptionData> = []
  public direcaoOuOrgao: Array<Select2OptionData> = []

  public patentes: Array<Select2OptionData> = [];
  public _patentes: any;

  constructor(
    private fb: FormBuilder,private vagaPromocaoService:VagaParaPromocaoService,
    private tipoLicenca:TipoLicencasService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private patenteService: PatenteService,
    private tipoCarreiraOuCategoriaService: TipoCarreiraOuCategoriaService,
  ) {
    this.eventRegistarOuEditModel = new EventEmitter<boolean>()
    this.createForm();

  }
  ngOnDestroy(): void {
    this.cargo=null
  }

  listarOrgaos()
  {
    this.direcaoOuOrgaoService.listarTodos({})
        .pipe(
          finalize((): void => {

          })
        )
        .subscribe((response: any): void => {
          this.direcaoOuOrgao = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
        })
  }

  private buscarTipoCarreiraOuCategoria(event: any): void {
    if (!event) return

    const opcoes = {
      regime_id: event
    }
    this.tipoCarreiraOuCategoriaService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.tipoCarreiraOuCategorias = response.map((item: any) => ({ id: item.id, text: item.nome }))

      })
  }

  buscarPostoPolicial() {

    this.patenteService.listar({})
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.patentes = response
          .filter((item: any) => item.id < 17) // Filtra os itens com id menor que 17
          .map((item: any) => ({ id: item.id, text: item.nome })); // Mapeia os itens filtrados

          this._patentes=response

      })
  }

  ngOnInit(): void {
    this.listarOrgaos()
    this.buscarPostoPolicial()
    this.buscarTipoCarreiraOuCategoria(1)
    this.simpleForm.get('tipo_carreiras_id')?.disable()
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
      tipo_carreiras_id: ['', [Validators.required]],
      pessoajuridica_id: ['', [Validators.required]],
      patentes_id: ['', [Validators.required]],
      quantidade: [1, [Validators.required]],
      data_inicio: ['', [Validators.required]],
      data_fim: ['', [Validators.required]],
      activo: [true]
    });
    this.carregarTipoLicencas()
  }


  public setarCarreiraOrCategoria(idPatente:any)
  {
    if(idPatente)
    {
      const patente = this._patentes.find((p:any) => p.id == idPatente);
      if(patente){
        const carreira= this.tipoCarreiraOuCategorias.find(item=>item.id==patente.sigpq_tipo_carreira_id)
        this.simpleForm.get('tipo_carreiras_id')?.setValue(carreira?.id)
      }

    }
  }



  preenchaCurso(data: any) {
    this.carregarTipoLicencas()
    this.createForm();
    this.simpleForm.patchValue({
      tipo_carreiras_id: data.tipo_carreiras_id,
      pessoajuridica_id: data.pessoajuridica_id,
      patentes_id: data.patentes_id,
      quantidade: data.quantidade,
      activo: data.activo,
      data_inicio: this.converterDataParaNormal(data.data_inicio),
      data_fim: this.converterDataParaNormal(data.data_fim)
    });
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

    //const formData = { ...this.simpleForm.value,data_inicio:this.convertDataParaValida(this.simpleForm.value.data_inicio),data_fim:this.convertDataParaValida(this.simpleForm.value.data_fim)};
    const formData = { ...this.simpleForm.value};

    console.log("DADOS A SEREM ENVIADOS:",formData)
    const type = this.buscarId ? this.vagaPromocaoService.editar(formData, this.buscarId) : this.vagaPromocaoService.registar(formData)
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
