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
import { DepartamentoService } from '@shared/services/config/Departamento.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { Subject, finalize, takeUntil } from 'rxjs';

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
  public destroy$ = new Subject<void>()

  pessoajuridicas: Array<Select2OptionData> = []
  pessoajuridicasClone: any = []
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  perfis: any

  @Input() public departamento: any = null
  @Output() eventRegistarOuEditModel = new EventEmitter<boolean>()

  constructor(
    private fb: FormBuilder,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private departamentoService: DepartamentoService,
    private modalService: ModalService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,

  ) { }

  ngOnInit(): void {
    this.createForm();
    this.buscarTipoEstruturaOrganica()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['departamento'].currentValue != changes['departamento'].previousValue && this.departamento) {
      this.preenchaForm()
    }
  }

  private preenchaForm() {
    this.selecionarOrgaoOuComandoProvincial(this.departamento?.tipo_estrutura_organica_sigla)
    // console.log(this.departamento)
    this.simpleForm.patchValue({
      estruturaOrganica: this.departamento?.tipo_estrutura_organica_sigla,
      sigla: this.departamento?.sigla,
      nome_completo: this.departamento?.nome_completo,
      pessoajuridica_id: this.departamento?.pessoajuridica_id,
      tipo_pessoajuridica_id: this.departamento?.tipo_pessoajuridica_id,
      orgao_comando_provincial: this.departamento?.orgao_comando_provincial,
      descricao: [ this.departamento?.descricao],
      activo: [true],

    });
  }
  private buscarTipoEstruturaOrganica() {
    this.estruturaOrganicaServico.listar({})
      .pipe(
        takeUntil(this.destroy$),
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.tipoEstruturaOrganicas = response.map((item: any) => ({ id: item.sigla, text: item.name }))
      })
  }
  createForm() {
    this.simpleForm = this.fb.group({
      estruturaOrganica: [null, Validators.required],
      sigla: ['', [Validators.required]],
      nome_completo: ['', [Validators.required, Validators.minLength(4)]],
      pessoajuridica_id: [null, [Validators.required]],
      tipo_pessoajuridica_id: [null, Validators.required],
      orgao_comando_provincial: [null, Validators.required],
      descricao: [''],
      activo: [true],
    });
    this.departamento=null
  }



  onSubmit() {

    if (this.simpleForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true
    const type =
      this.buscarId() ?
        this.departamentoService.editar(this.simpleForm.value, this.buscarId()) :
        this.departamentoService.registar(this.simpleForm.value)

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

    this.simpleForm.get('activo')?.setValue(true)
  }

  buscarId(): number {
    return this.departamento?.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete
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
        this.pessoajuridicasClone = response
        this.pessoajuridicas = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
      })
  }

  public selecionarDireccao($event: any) {
    if (!$event) return
    const [pessoajuridicasSelecionado] = this.pessoajuridicasClone.filter((p: any) => p.id == $event)

    if (pessoajuridicasSelecionado?.tipo_estrutura_organica_sigla?.toString()?.includes('UT')) {
      this.simpleForm.get('tipo_pessoajuridica_id')?.setValue(7)
      this.simpleForm.get('orgao_comando_provincial')?.setValue('Comando Municipal')
    } else if (pessoajuridicasSelecionado?.tipo_estrutura_organica_sigla?.toString()?.includes('SAT')) {
      this.simpleForm.get('tipo_pessoajuridica_id')?.setValue(2)
      this.simpleForm.get('orgao_comando_provincial')?.setValue('Departamento')
    } else if (pessoajuridicasSelecionado?.tipo_estrutura_organica_sigla?.toString()?.includes('UC')) {
      this.simpleForm.get('tipo_pessoajuridica_id')?.setValue(6)
      this.simpleForm.get('orgao_comando_provincial')?.setValue('Unidade')
    } else {
      this.simpleForm.get('tipo_pessoajuridica_id')?.setValue(null)
      this.simpleForm.get('orgao_comando_provincial')?.setValue(null)

    }

  }
}


