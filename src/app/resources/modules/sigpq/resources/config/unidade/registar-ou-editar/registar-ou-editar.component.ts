import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '@core/services/config/Modal.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { SeccaoService } from '@shared/services/config/Seccao.service';
import { UnidadeService } from '@shared/services/config/Unidade.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'sigpq-registar-ou-editar-modal',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit {

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  };

  simpleForm: FormGroup = new FormGroup({})
  isLoading: boolean = false

  pessoajuridicas: Array<Select2OptionData> = []
  departamentos: Array<Select2OptionData> = []
  departamentosClone: any = []
  seccaos: Array<Select2OptionData> = []

  @Input() public seccao: any = null
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  @Output() eventRegistarOuEditModel = new EventEmitter<boolean>()

  constructor(
    private fb: FormBuilder,
    private seccaoService: SeccaoService,
    private modalService: ModalService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private unidadeService: UnidadeService
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
      departamento_id: this.seccao.departamento_id,
      seccao_id: this.seccao?.seccao_id,
      estruturaOrganica: this.seccao?.tipo_estrutura_organica_sigla,
      tipo_pessoajuridica_id: this.seccao?.tipo_pessoajuridica_id,
      orgao_comando_provincial: this.seccao?.orgao_comando_provincial,
      descricao: [''],
      activo: [true],
    });

  }

  createForm() {
    this.simpleForm = this.fb.group({
      sigla: ['', [Validators.required]],
      nome_completo: ['', [Validators.required, Validators.minLength(4)]],
      direcao_id: ['', Validators.required],
      estruturaOrganica: ['', Validators.required],
      departamento_id: [null, [Validators.required]],
      seccao_id: [null, [Validators.required]],
      tipo_pessoajuridica_id: [8, Validators.required],
      orgao_comando_provincial: ['Posto Policial', Validators.required],
      descricao: [''],
      activo: [true],
    });
  }


  buscarSeccoes($evt: any) {
    if (!$evt) return

    const options = { departamentoId: $evt };
    this.seccaoService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      this.seccaos = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))

    });
  }



  private buscarTipoEstruturaOrganica() {
    this.estruturaOrganicaServico.listar({})
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.tipoEstruturaOrganicas = []
        let aux = response.map((item: any) => ({ id: item.sigla, text: item.name }))
        aux = aux.filter((item: any) => ['ut', 'uc'].includes(item?.id?.toString().toLowerCase()))

        this.tipoEstruturaOrganicas.push(...aux)
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

  public selecionarDepartamento($evt: any): void {

    if (!$evt) return

    const options = { departamentoId: $evt };
    this.seccaoService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      this.seccaos = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))

    });

    // if (!$event) return
    // const [departamentoSelecionado] = this.departamentosClone.filter((d: any) => d.id == $event)

    // if (departamentoSelecionado?.orgao_comando_provincial?.toString()?.includes('Comando Municipal')) {
    //   this.simpleForm.get('tipo_pessoajuridica_id')?.setValue(8)
    //   this.simpleForm.get('orgao_comando_provincial')?.setValue('Esquadra')
    // } else if (departamentoSelecionado?.orgao_comando_provincial?.toString()?.includes('Departamento')) {
    //   this.simpleForm.get('tipo_pessoajuridica_id')?.setValue(3)
    //   this.simpleForm.get('orgao_comando_provincial')?.setValue('Secção')
    // } else if (departamentoSelecionado?.orgao_comando_provincial?.toString()?.includes('Unidade')) {
    //   this.simpleForm.get('tipo_pessoajuridica_id')?.setValue(10)
    //   this.simpleForm.get('orgao_comando_provincial')?.setValue('Subunidade')
    // }
    // else {
    //   this.simpleForm.get('tipo_pessoajuridica_id')?.setValue(null)
    //   this.simpleForm.get('orgao_comando_provincial')?.setValue(null)
    // }
  }

  onSubmit() {



    if (this.simpleForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true
    const type =
      this.buscarId() ?
        this.unidadeService.editar(this.simpleForm.value, this.buscarId()) :
        this.unidadeService.registar(this.simpleForm.value)

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
      tipo_pessoajuridica_id: 8,
      orgao_comando_provincial: 'Posto Policial',
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
