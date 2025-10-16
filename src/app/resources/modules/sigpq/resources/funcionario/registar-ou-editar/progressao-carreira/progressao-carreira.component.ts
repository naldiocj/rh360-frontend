import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { PatenteService } from '@core/services/Patente.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { ProvimentoService } from '@resources/modules/sigpq/core/service/Provimento.service';
import { TipoCargoService } from '@resources/modules/sigpq/core/service/Tipo-cargo.service';
import { ActoProgressaoService } from '@resources/modules/sigpq/core/service/config/Acto-Progressao.service';
import { TipoCarreiraOuCategoriaService } from '@resources/modules/sigpq/core/service/config/Tipo-carreira-ou-categoria.service';
import { TipoFuncaoService } from '@resources/modules/sigpq/core/service/config/TipoFuncao.service';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { Subject, finalize, takeUntil } from 'rxjs';

// const SITUACAO_ACTUAL = 'actual'
@Component({
  selector: 'sigpq-progressao-carreira',
  templateUrl: './progressao-carreira.component.html',
  styleUrls: ['./progressao-carreira.component.css']
})
export class ProgressaoCarreiraComponent implements OnInit {

  public simpleForm!: any
  public updateDataForm: any;
  public carregando: boolean = false
  public emTempo: any;
  public submitted: boolean = false;
  public id: any
  public provimentos: any = []
  public fileUrl: any
  public funcionario: any

  private destroy$ = new Subject<void>();




  public documento: any
  public carregarDocumento: any
  public totalBase: number = 0;
  public pagination: Pagination = new Pagination();
  public tipoFuncaos: Array<Select2OptionData> = []

  public filtro = {
    page: 1,
    perPage: 5,
    search: ''
  }

  @Input() public params: any
  @Input() public options: any

  // public validarDataInicial = this.formatarDataHelper.getPreviousDate(0, 0, 0, 'yyyy-MM-dd')

  public validarDataAdesao = this.formatarDataHelper.getPreviousDate(0, 0, 0, 'yyyy-MM-dd')

  public patentes: Array<Select2OptionData> = []
  public actoProgressaos: Array<Select2OptionData> = []
  public fromTipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public toTipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public tipoCargos: Array<Select2OptionData> = []
  public tipoCarreiraOuCategorias: Array<Select2OptionData> = []
  public tipoCarreiraOuCategorias_: Array<Select2OptionData> = []

  constructor(
    private fb: FormBuilder,
    private patenteService: PatenteService,
    private actoProgressaoService: ActoProgressaoService,
    private provimentoService: ProvimentoService,
    private formatarDataHelper: FormatarDataHelper,
    private ficheiroService: FicheiroService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
    private tipoFuncaoService: TipoFuncaoService,
    private tipoCargoService: TipoCargoService,
    private tipoCarreiraOuCategoriaService: TipoCarreiraOuCategoriaService,
    private funcionarioService: FuncionarioService


  ) { }

  ngOnInit(): void {
    this.createForm()
    this.buscarActoProgressao()
    this.buscarTipoEstruturaOrganica()
    this.buscarProvimentos()
    this.buscarTipoFuncao()
    this.buscarTipoCargo()
    this.buscarFuncionario()
  }

  regime_do_agente:string='1';
  private buscarFuncionario() {
    if (!this.getPessoaId) return
    this.funcionarioService.buscarUm(this.getPessoaId).pipe(
      finalize((): void => {
        this.buscarTipoCarreiraOuCategoria(this.funcionario?.regime_id)
        this.regime_do_agente=this.funcionario?.regime_id
      })
    ).subscribe({
      next: (response: any) => {
        this.funcionario = response
      }
    })
  }

  private buscarTipoCargo(): void {
    const opcoes = {}
    this.tipoCargoService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.tipoCargos = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })
  }

  private buscarTipoFuncao(): void {
    const opcoes = {}
    this.tipoFuncaoService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.tipoFuncaos = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })
  }
  public handlerCollapse($evt: any) {
    const collapse: any = document.querySelector(`#${$evt}`)
    const faInput: any = collapse.querySelector('.fa-1');

    if (faInput) {
      faInput.classList.toggle('fa-plus');
      faInput.classList.toggle('fa-minus');
    }
  }
  private buscarTipoEstruturaOrganica() {
    this.estruturaOrganicaServico.listar({})
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {

        this.fromTipoEstruturaOrganicas = response.map((item: any) => ({ id: item.sigla, text: item.name }))
        this.toTipoEstruturaOrganicas = response.map((item: any) => ({ id: item.sigla, text: item.name }))
      })
  }

  private createForm() {
    this.simpleForm = this.fb.group({
      patente_id: [null, [Validators.required,]],
      situacao: ['anterior', Validators.required],
      numero_despacho: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      numero_ordem: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      sigpq_acto_progressao_id: ['', [Validators.required]],
      anexo: [null, Validators.required],
      data_ordem: [null, Validators.required],
      data_despacho: [null, Validators.required],

      sigpq_tipo_categoria_id: [null, Validators.required],
      pessoa_id: [this.getPessoaId, Validators.required]

    });

    this.updateDataForm = this.fb.group({
      numero_ordem: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      ordem_data: ['', Validators.required],
      numero_despacho: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      despacho_data: ['', Validators.required],
    });
  }

  private get formData() {
    const formData = new FormData()
    formData.append('pessoas_id', this.simpleForm.value?.pessoa_id)
    formData.append('sigpq_acto_progressao_id', this.simpleForm.value.sigpq_acto_progressao_id)
    formData.append('sigpq_tipo_categoria_id', this.simpleForm.value.sigpq_tipo_categoria_id)
    formData.append('patente_id', this.simpleForm.value.patente_id)
    formData.append('anexo', this.simpleForm.value.anexo)
    formData.append('data_provimento', this.simpleForm.value.data_provimento)
    formData.append('situacao', String(this.simpleForm.value.situacao))
    formData.append('numero_despacho', this.simpleForm.value.numero_despacho)
    formData.append('numero_ordem', this.simpleForm.value.numero_ordem)
    formData.append('data_ordem', this.simpleForm.value.data_ordem)
    formData.append('data_despacho', this.simpleForm.value.data_despacho)

    return formData
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
        this.tipoCarreiraOuCategorias = response.filter((item: any) => item.nome.toUpperCase() !== "Tesoureiro".toUpperCase())
        .map((item: any) => ({ id: item.id, text: item.nome }))
        this.tipoCarreiraOuCategorias_ = response;
      })
  }

  public buscarActoProgressao(): void {
    const opcoes = {}
    this.actoProgressaoService.listar(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.actoProgressaos = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })
  }

  public uploadFile(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0]
    this.simpleForm.get(campo)?.setValue(file);
    this.simpleForm.get(campo)?.updateValueAndValidity();
  }



  public onSubmit() {

    if (this.simpleForm.invalid || this.submitted) {
      return;
    }

    this.submitted = true;
    this.carregando = true;

    const data = this.formData


    const type = this.getId ? this.provimentoService.editar(this.getId, data) : this.provimentoService.registar(data)

    type.pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.carregando = false
        this.submitted = false
      })
    ).subscribe(() => {
      this.recarregarPagina()
      this.reiniciarFormulario()

    })

    // console.log(this.simpleForm.value)

  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5
    this.filtro.search = ''

    this.buscarProvimentos()
  }

  zerarFormularioAtualziacao()
  {
    this.updateDataForm.reset()
  }

  atualizarDados() {
    if (this.updateDataForm.valid) {
      const dadosAtualizados = this.updateDataForm.value;
      this.provimentoService.atualizar_data_provimento(this._provimentoSelecionado.id, dadosAtualizados).pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.carregando = false
          this.submitted = false
        })
      ).subscribe((response:any) => {
        this.recarregarPagina()
        this.reiniciarFormulario()

      })
    } else {
      console.error('O formulário está inválido!');
    }
  }


  public validarClasse(evt: any = null, geral: boolean = false) {
    if (!evt && !geral) return

    geral = evt >= 1 && evt <= 6 ? true : false

    const options = {
      sigpq_tipo_carreira_id: evt,
      //tecnico: Number(geral)
    }


    this.patenteService.listar(options)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.patentes = response.map((item: any) => ({ id: item.id, text: item.nome }))

      })
  }



  public filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarProvimentos()

  }

  public reiniciarFormulario() {

    $('#input-provimento').val('')
    this.simpleForm.reset()
    this.simpleForm.patchValue({ pessoa_id: this.getPessoaId, situacao: 'anterior', data_provimento: new Date() })

  }
_provimentoSelecionado:any
 public provimentoSelecionado(provimento:any)
 {
   this._provimentoSelecionado=provimento
 }

  private buscarProvimentos() {
    this.provimentoService.listarTodos({ ...this.filtro, pessoa_id: this.getPessoaId }).pipe().subscribe({
      next: (response: any) => {
        console.log("Provimentos:",response)
        this.provimentos = response.data


        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);

      }


    })
  }


  public formatDate(data: any) {
    return this.formatarDataHelper.formatDate(data)
  }
  public get getPessoaId(): any {
    return this.params?.getInfo as number ?? this.params.getId as number;
  }



  public get getId() {
    return this.id
  }




  visualizar(documento: any) {


    const opcoes = {
      pessoaId: this.getId,
      url: ''
    }

    this.fileUrl = null


    opcoes.url = documento.anexo || null
    this.documento = documento

    if (!opcoes.url) return false

    this.carregarDocumento = true
    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
        this.carregarDocumento = false
      })
    ).subscribe((file) => {
      this.fileUrl = this.ficheiroService.createImageBlob(file);
    });

    return true
  }

  construcao() {
    alert('Em construção')
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
