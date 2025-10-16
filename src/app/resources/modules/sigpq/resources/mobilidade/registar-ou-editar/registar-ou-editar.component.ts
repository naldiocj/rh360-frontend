import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { finalize, Subject } from 'rxjs'

import { FuncionarioValidation } from '@resources/modules/sigpq/shared/validation/funcionario.validation'
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { MobilidadeService } from '@resources/modules/sigpq/core/service/Mobilidade.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { SeccaoService } from '@shared/services/config/Seccao.service';
import { DepartamentoService } from '@shared/services/config/Departamento.service';
import { UnidadeService } from '@shared/services/config/Unidade.service';

@Component({
  selector: 'app-sigpq-mobilidade-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnInit {

  @Output() eventRegistarOuEditModel = new EventEmitter<boolean>()
  @Input() agentesId: any
  @Input() numeroGuia: any
  public mobilidade: any = null

  private destroy$ = new Subject<void>();

  data: any = [
    { id: 1, text: `Orgão central` },
    { id: 2, text: `Orgao provincial` }
  ]

  public tipoOrgaos: Array<Select2OptionData> = []
  public orgaos: Array<Select2OptionData> = []

  public departamentos: Array<Select2OptionData> = [];
  public seccoes: Array<Select2OptionData> = [];
  public unidades: Array<Select2OptionData> = [];
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public brigadas: Array<Select2OptionData> = [];
  public validarDataAdesao = this.formatarDataHelper.getPreviousDate(0, 0, 0, 'yyyy-MM-dd')


  simpleForm: any

  isLoading: boolean = false
  submitted: boolean = false

  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: 'null', text: "Selecione uma opção" },
    { id: 'Comando Provincial', text: "Comando Provincial" },
    { id: 'Orgão', text: "Orgão Central" },
  ]


  formErrors: any

  filtro = {
    page: 1,
    perPage: 5,
    regimeId: 'null',
    patenteId: 'null',
    patenteClasse: 'null',
    tipoVinculoId: 'null',
    tipoOrgaoId: 'null',
    orgaoId: 'null',
    genero: 'null',
    search: "",
    dashboard: false
  }

  options: any = {
    placeholder: "Selecione uma opção",
    width: '100%'
  }

  public validarDataNascimento = this.formatarDataHelper.getPreviousDate(0, 0, 0, 'yyyy-MM-dd')

  constructor(
    // private funcionarioServico: FuncionarioService,
    private formatarDataHelper: FormatarDataHelper,
    public funcValidacao: FuncionarioValidation,
    private activatedRoute: ActivatedRoute,
    private mobilidadeService: MobilidadeService,
    private fb: FormBuilder,

    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
    private seccaoService: SeccaoService,
    private departamentoService: DepartamentoService,
    private unidadeService: UnidadeService

  ) {
    this.createForm()
  }

  ngOnInit(): void {
    this.buscarTipoEstruturaOrganica()
  }

  buscarBrigada($e: any) {
    if (!$e) return


    const options = { seccaoId: $e };

    this.unidadeService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response) => {
      this.brigadas = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))


    });
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['numeroGuia'].currentValue != changes['numeroGuia'].previousValue && this.numeroGuia != null) {
  //     console.log('hello world')
  //     this.getMobilidadePorGuia(this.numeroGuia)
  //   }
  // }

  // private getMobilidadePorGuia(guia: any) {
  //   this.mobilidadeService.listarPorGuia(guia).pipe().subscribe({
  //     next: (response: any) => {
  //       this.mobilidade = response

  //     }
  //   })
  // }
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


  public get getId() {
    return this.activatedRoute.snapshot.params["id"] as number
  }

  createForm() {
    this.simpleForm = this.fb.group({
      agentes_id: this.fb.array([]),
      orgao_destino_id: [null, [Validators.required]],
      numero_despacho: [null, [Validators.required]],
      data_ingresso: [null, [Validators.required]],
      anexo: [null],
      ordenante: [null],
      departamento_id: [null],
      seccao_id: [null],
      brigada_id: [null],
      data_despacho: [null, [Validators.required]],
      situacao: ['actual', Validators.required]
    })
  }

  uploadFile(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0]
    this.simpleForm.get(campo)?.setValue(file);
    this.simpleForm.get(campo)?.updateValueAndValidity();
  }

  selecionarOrgaoOuComandoProvincial($event: any): void {

    const opcoes = {
      tipo_estrutura_sigla: $event
    }
    this.direcaoOuOrgaoService.listarTodos(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.orgaos = []
        const org = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
        this.orgaos.push(...org)
      })

  }

  onSubmit() {

    if (this.simpleForm.invalid || this.submitted) {
      return
    }

    this.submitted = true
    this.isLoading = true

    this.simpleForm.value.agentes_id = this.agentesId.map((agente: any) => agente.id)

    const form = this.getFormDados


    const type = this.getId ? this.mobilidadeService.editar(this.getId, form) : this.mobilidadeService.registar(form)

    type
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false
          this.submitted = false
        })
      ).subscribe((response) => {
        this.restaurarFormulario()
        this.removerModal()
        this.eventRegistarOuEditModel.emit(true)
      })



  }

  private removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  private gerarPDF(info: any) {
    console.log(info)
  }

  // public buscarUnidade($event: any) {
  //   if (!$event) return
  //   const opcoes = {
  //     pessoajuridica_id: $event,
  //     entidade: 'Unidade',
  //   }
  //   this.departamentoService.listarTodos(opcoes).pipe(
  //     finalize((): void => {

  //     })
  //   ).subscribe({
  //     next: (response: any) => {

  //       this.unidades = response.map((item: any) => ({ id: item.id, text: item.sigla + " - " + item.nome_completo }))
  //     }
  //   })
  // }
  public buscarDepartamento($event: any) {
    if (!$event) return

    const opcoes = {
      pessoajuridica_id: $event
    }
    this.departamentoService.listarTodos(opcoes).pipe(
      finalize((): void => {

      })
    ).subscribe({
      next: (response: any) => {
        this.departamentos = response.map((item: any) => ({ id: item.id, text: item.sigla + " - " + item.nome_completo }))
      }
    })
  }

  private get getFormDados() {
    const dados = new FormData()

    dados.append('agentes_id', this.simpleForm.value?.agentes_id)
    dados.append('orgao_destino_id', this.simpleForm.get('orgao_destino_id')?.value)
    dados.append('anexo', this.simpleForm.get('anexo')?.value)
    dados.append('despacho', this.simpleForm.get('numero_despacho')?.value)
    dados.append('data_ingresso', this.simpleForm.get('data_ingresso')?.value)
    dados.append('ordenante', this.simpleForm.get('ordenante')?.value)

    dados.append('departamento_id', this.simpleForm.get('departamento_id')?.value)
    dados.append('seccao_id', this.simpleForm.get('seccao_id')?.value)
    dados.append('brigada_id', this.simpleForm.get('brigada_id')?.value)
    dados.append('data_despacho', this.simpleForm.get('data_despacho')?.value)
    dados.append('situacao', this.simpleForm.get('situacao')?.value)

    return dados
  }

  restaurarFormulario() {
    this.simpleForm.reset()
    this.agentesId = []
    this.simpleForm.value.agentes_id = []
    this.simpleForm.get('anexo')?.setValue(null);
    this.simpleForm.patchValue({
      situacao: 'actual'
    })
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public selecionarDepartamento($event: any) {
    this.seccoes = []
    if (!$event) return
    const opcoes = {
      departamentoId: $event
    }
    this.seccaoService.listarTodos(opcoes).pipe(
      finalize((): void => {

      })
    ).subscribe({
      next: (response: any) => {
        this.seccoes = response.map((item: any) => ({ id: item.id, text: item.sigla + " - " + item.nome_completo }))
      }
    })
  }
  public selecionarSeccao($event: any) {
    // this.seccoes = []
    if (!$event) return
    const opcoes = {
      departamentoId: $event
    }
    this.seccaoService.listarTodos(opcoes).pipe(
      finalize((): void => {

      })
    ).subscribe({
      next: (response: any) => {
        this.brigadas = response.map((item: any) => ({ id: item.id, text: item.sigla + " - " + item.nome_completo }))
      }
    })
  }
}
