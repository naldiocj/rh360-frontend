import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { finalize } from 'rxjs';
import { Select2OptionData } from 'ng-select2';
import { DepartamentoService } from '@shared/services/config/Departamento.service';
import { ModalService } from '@core/services/config/Modal.service';
import { SecureService } from '@core/authentication/secure.service';
import { UtilService } from '@resources/modules/pa/core/helper/util.service';
import { EscalaTrabalhaService } from '@resources/modules/pa/core/service/escala-trabalha.service';

@Component({
  selector: 'app-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit, OnChanges {

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  };

  simpleForm: FormGroup = new FormGroup({})
  isLoading: boolean = false

  // @Input() public departamento: any = null
  @Output() eventRegistarOuEditModel = new EventEmitter<boolean>()
  @Input() public pessoadID: any
  @Input() public funcionario: any
  @Input() escalaTrabalho: any


  public turnos: Array<Select2OptionData> = []
  public departamentos: Array<Select2OptionData> = []


  constructor(
    private fb: FormBuilder,
    private departamentoService: DepartamentoService,
    private modalService: ModalService,
    private utilService: UtilService,
    private secureService: SecureService,
    private escalaTrabalhoService: EscalaTrabalhaService
  ) {

    this.turnos = [{ id: 'M', text: 'Manhã' }, { id: 'T', text: 'Tarde' }, { id: 'N', text: 'Noite' },]
  }

  ngOnInit(): void {
    this.buscarDepartamentos()
    this.createForm();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['escalaTrabalho']?.previousValue != changes['escalaTrabalho']?.currentValue) {
      this.preenchaForm(this.escalaTrabalho)
    }
  }


  private preenchaForm(dado: any) {
    console.log(dado)
    this.buscarDepartamentos()

    this.simpleForm.patchValue({
      pessoafisica_id: dado.pessoafisica_id,
      pessoajuridica_id: dado.pessoajuridica_id,
      departamento_id: dado.departamento_id,
      data: dado.date,
      descricao: dado.descricao,
      estado: dado.estado,
      turno: dado.turno,
      seccao: dado.seccao
    });

    // this.buscarDepartamentos()
    this.departamentos = [{ id: dado.departamento_id, text: dado.departamento_sigla + '' + dado.departamento }]
  }


  private createForm() {
    this.simpleForm = this.fb.group({
      pessoafisica_id: [this.getPessoafisicaId, Validators.required],
      pessoajuridica_id: [this.getPessoajuridicaId, Validators.required],
      departamento_id: ['', [Validators.required]],
      data: ['', [Validators.required, Validators.minLength(7)]],
      descricao: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      estado: ['E'],
      turno: ['', Validators.required],
      seccao: ['', Validators.compose([Validators.required, Validators.minLength(10)])]

    });
  }

  private buscarDepartamentos() {

    this.departamentoService.listarTodos({ pessoajuridica_id: this.getPessoajuridicaId }).pipe(
      finalize(() => {
      })
    ).subscribe((response: any) => {

      this.departamentos = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
    });
  }

  public onSubmit() {
    this.isLoading = true
    console.log(this.simpleForm.value)
    const type = this.buscarId() ?
      this.escalaTrabalhoService.editar(this.buscarId(), this.simpleForm.value) :
      this.escalaTrabalhoService.registar(this.simpleForm.value)

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

  public reiniciarFormulario() {
    this.simpleForm.reset()
    this.simpleForm.get('pessoafisica_id')?.setValue(this.getPessoafisicaId)
    this.simpleForm.get('pessoajuridica_id')?.setValue(this.getPessoajuridicaId)
  }

  public buscarId(): number {
    return this.escalaTrabalho?.id;
  }


  private get getPessoafisicaId(): any {
    return this.pessoadID as number
  }

  private get getPessoajuridicaId(): any {
    return this.secureService.getTokenValueDecode().orgao.id
  }



  public get getAno() {
    return this.utilService.dataActual
  }

  public get getFuncionario(): any {
    return this.funcionario;
  }
}
