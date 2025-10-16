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

import { ModalService } from '@core/services/config/Modal.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { SeccaoService } from '@shared/services/config/Seccao.service';

import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'sigpq-registar-ou-editar-modal',
  templateUrl: './registar-ou-editar-modal.component.html',
  styles: [
    ` /deep/ .ng-dropdown-panel .scroll-host {
          max-height: 120px  !important;
      }
  `]
})
export class RegistarOuEditarModalComponent implements OnInit, OnChanges {

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  };

  simpleForm: FormGroup = new FormGroup({})
  isLoading: boolean = false

  pessoajuridicas: Array<Select2OptionData> = []
  departamentos: Array<Select2OptionData> = []
  departamentosClone: any = []

  @Input() public seccao: any = null
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  @Output() eventRegistarOuEditModel = new EventEmitter<boolean>()

  constructor(
    private fb: FormBuilder,
    private seccaoService: SeccaoService,
    private modalService: ModalService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.buscarTipoEstruturaOrganica()

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['seccao'].currentValue != changes['seccao'].previousValue && this.seccao != null) {
      this.preenchaForm()
    }
  }

  private preenchaForm() {

    this.selecionarOrgaoOuComandoProvincial(this?.seccao?.tipo_estrutura_organica_sigla)

    this.simpleForm.patchValue({
      sigla: this.seccao?.sigla,
      nome_completo: this.seccao?.nome_completo,
      direcao_id: this.seccao?.orgao_id,
      estruturaOrganica: this.seccao?.tipo_estrutura_organica_sigla,
      pessoajuridica_id: this.seccao?.departamento_id,
      tipo_pessoajuridica_id: this.seccao?.tipo_estrutura_sigla,
      orgao_comando_provincial: this.seccao?.orgao_comando_provincial,
      descricao: this.seccao?.descricao,
      activo: [true],
    });

  }

  createForm() {
    this.simpleForm = this.fb.group({
      sigla: ['', [Validators.required]],
      nome_completo: ['', [Validators.required, Validators.minLength(4)]],
      direcao_id: ['', Validators.required],
      estruturaOrganica: ['', Validators.required],
      pessoajuridica_id: ['', [Validators.required]],
      tipo_pessoajuridica_id: [null, Validators.required],
      orgao_comando_provincial: [null, Validators.required],
      descricao: [''],
      activo: [true],
    });
    this.seccao=null
  }

  private buscarTipoEstruturaOrganica() {
    this.estruturaOrganicaServico.listar({})
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.tipoEstruturaOrganicas = response.map((item: any) => ({ id: item.sigla, text: item.name }))
      })
  }


  public selecionarDireccao($event: any): void {
    if (!$event) return

    const opcoes = {
      pessoafisica: $event
    }
    this.direcaoOuOrgaoService.listarTodos(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.departamentosClone = response
        this.departamentos = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
      })
  }

  public selecionarDepartamento($event: any): void {

    if (!$event) return
    const [departamentoSelecionado] = this.departamentosClone.filter((d: any) => d.id == $event)

    if (departamentoSelecionado?.orgao_comando_provincial?.toString()?.includes('Comando Municipal')) {
      this.simpleForm.get('tipo_pessoajuridica_id')?.setValue(8)
      this.simpleForm.get('orgao_comando_provincial')?.setValue('Esquadra')
    } else if (departamentoSelecionado?.orgao_comando_provincial?.toString()?.includes('Departamento')) {
      this.simpleForm.get('tipo_pessoajuridica_id')?.setValue(3)
      this.simpleForm.get('orgao_comando_provincial')?.setValue('Secção')
    } else if (departamentoSelecionado?.orgao_comando_provincial?.toString()?.includes('Unidade')) {
      this.simpleForm.get('tipo_pessoajuridica_id')?.setValue(10)
      this.simpleForm.get('orgao_comando_provincial')?.setValue('Subunidade')
    }
    else {
      this.simpleForm.get('tipo_pessoajuridica_id')?.setValue(null)
      this.simpleForm.get('orgao_comando_provincial')?.setValue(null)
    }
  }

  onSubmit() {

    if (this.simpleForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true

    const type =
      this.buscarId() ?
        this.seccaoService.editar(this.simpleForm.value, this.buscarId()) :
        this.seccaoService.registar(this.simpleForm.value)

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
    this.simpleForm.patchValue({
      activo: [true],
    })
  }

  buscarId(): number {
    return this.seccao?.id;
  }

  ngOnDestroy(): void {
  }

  selecionarOrgaoOuComandoProvincial($event: any): void {
    if (!$event) return

    const opcoes = {
      tipo_estrutura_sigla: $event
    }
    this.direcaoOuOrgaoService.listarTodos(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.pessoajuridicas = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
      })
  }

}
