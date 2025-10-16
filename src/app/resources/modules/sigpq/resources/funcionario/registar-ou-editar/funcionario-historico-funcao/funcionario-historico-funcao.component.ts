import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { PatenteService } from '@core/services/Patente.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { FuncaoService } from '@resources/modules/sigpq/core/service/Funcao.service';

import { ActoNomeacaoService } from '@resources/modules/sigpq/core/service/config/Acto-Nomeacao.service';
import { TipoCarreiraOuCategoriaService } from '@resources/modules/sigpq/core/service/config/Tipo-carreira-ou-categoria.service';
import { TipoFuncaoService } from '@resources/modules/sigpq/core/service/config/TipoFuncao.service';
import { Pagination } from '@shared/models/pagination';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
@Component({
  selector: 'sigpq-funcionario-historico-funcao',
  templateUrl: './funcionario-historico-funcao.component.html',
  styleUrls: ['./funcionario-historico-funcao.component.css']
})
export class FuncionarioHistoricoFuncaoComponent implements OnInit {

  public simpleForm: any
  public carregando: boolean = false;
  public totalBase: number = 0;
  public pagination: Pagination = new Pagination()
  public fileUrl: any
  public documento: any
  public carregarDocumento: boolean = false;

  @Input() public pessoaId: any
  @Input() public options: any
  @Input() public params: any
  public funcaos: any = []
  public funcao: any = null

  public submitted: boolean = false

  public id: any = null
  public tipo_acto: string | null = null
  public filtro = {
    page: 1,
    perPage: 5,
    search: ''
  }

  public validarDataAdesao = this.formatarDataHelper.getPreviousDate(0, 0, 0, 'yyyy-MM-dd')

  public tipoNomeacaoExoneracao: Array<Select2OptionData> = []
  @Input() public orgaoOuComandoProvincial: any;
  public validarDataInicial = this.formatarDataHelper.getPreviousDate(0, 0, 0, 'yyyy-MM-dd')
  public tipoCarreiraOuCategorias: Array<Select2OptionData> = []
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public tipoCarreiraOuCategorias_: Array<Select2OptionData> = []
  public funcionario: any = null

  ngOnInit(): void {
    // Garantir que o formulário seja criado antes de qualquer operação
    this.createForm()
    
    // Usar setTimeout para garantir que o formulário esteja pronto
    setTimeout(() => {
      this.buscarTipoFuncao()
      this.buscarNomeacao()
      this.buscarFuncaos()
      this.buscarFuncionario()
      this.buscarTipoEstruturaOrganica()
      this.selecionarOrgaoOuComandoProvincial()
      console.log("REGIME DO FUNCIONARIO:",this.funcionario?.regime_id)
    }, 0)
  }

  private buscarNomeacao() {
    this.actoNomeacaoService.listar({}).pipe().subscribe({
      next: (response: any) => {

        this.tipoNomeacaoExoneracao = response.map((item: any) => ({ id: item.id, text: item.nome }))
      }
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

  @Input() emTempo: any = null

  public patentes: Array<Select2OptionData> = []
  public actoProgressaos: Array<Select2OptionData> = []
  public direcaoOuOrgao: Array<Select2OptionData> = []
  public tipoFuncaos: Array<Select2OptionData> = []

  constructor(
    private fb: FormBuilder,
    private patenteService: PatenteService,
    public formatarDataHelper: FormatarDataHelper,
    private tipoFuncaoService: TipoFuncaoService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private actoNomeacaoService: ActoNomeacaoService,
    private funcaoService: FuncaoService,
    private ficheiroService: FicheiroService,
    private funcionarioService: FuncionarioService,
    private tipoCarreiraOuCategoriaService: TipoCarreiraOuCategoriaService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
  ) { }

  public createForm() {
    this.simpleForm = this.fb.group({
      patente_id: [null, Validators.required,],
      sigpq_tipo_categoria_id: [null, Validators.required],
      situacao: ['exercída', Validators.required],
      pessoajuridica_id: [null, [Validators.required]],
      sigpq_tipo_funcao_id: [null, Validators.required],
      tipo_orgao: [null, Validators.required],
      pessoafisica_id: [this.getPessoaId, Validators.required]
    });

  }

  private get formData() {
    const data = new FormData()

    data.append('patente_id', this.simpleForm.get('patente_id')?.value)
    data.append('situacao', this.simpleForm.get('situacao')?.value)
    data.append('pessoajuridica_id', this.simpleForm.get('pessoajuridica_id')?.value)
    data.append('sigpq_tipo_funcao_id', this.simpleForm.get('sigpq_tipo_funcao_id')?.value)
    data.append('pessoafisica_id', this.simpleForm.get('pessoafisica_id')?.value)

    return data
  }

  public formatDate(data: any): any {
    return this.formatarDataHelper.formatDate(data)
  }

  buscarPatente(): void {
    this.patenteService.listar({})
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.patentes = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })
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

  private buscarFuncaos() {
    this.funcaoService.listar({ ...this.filtro, pessoafisica_id: this.getPessoaId }).pipe().subscribe({
      next: (response: any) => {
        this.funcaos = response.data

        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);

      }
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
        this.tipoCarreiraOuCategorias = response.filter((item: any) => item.nome.toUpperCase() !== "Tesoureiro".toUpperCase())
        .map((item: any) => ({ id: item.id, text: item.nome }))
        this.tipoCarreiraOuCategorias_ = response;
      })
  }


  uploadFile(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0]
    this.simpleForm.get(campo)?.setValue(file);
    this.simpleForm.get(campo)?.updateValueAndValidity();
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


  public onSubmit() {

    if (this.simpleForm.invalid || this.submitted)
      return


    this.carregando = true
    this.submitted = true

    const data = this.formData

    const type = this.getId ? this.funcaoService.editar(this.getId, data) : this.funcaoService.registar(data)

    type
      .pipe(
        finalize(() => {
          this.carregando = false
          this.submitted = false;
        })
      ).subscribe(() => {
        this.reiniciarFormulario()
        this.recarregarPagina();

      })

  }

  public recarregarPagina(): void {
    this.filtro.page = 1;
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.buscarFuncaos()
  }

  public filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarFuncaos()

  }


  reiniciarFormulario() {
    this.simpleForm.reset()
    this.simpleForm.patchValue({
      pessoafisica_id: this.getPessoaId,
      situacao: ['exercída'],
    })
    $('#anexo_nomeacao').val('')
  }




  public get getId() {
    return this.id
  }

  // buscarId(): number {
  //   return this.em_tempo?.id;
  // }

  buscarTipoFuncao(): void {
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
  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  get getEmTempoPatenteId() {
    return this.emTempo?.patente_id
  }


  // public get buscarId(): any {
  //   return this.pessoaId;
  // }

  public selecionarPosicaoFuncao($event: any): void {
    if (!$event) {
      this.simpleForm.get('data')?.disable()
      this.simpleForm.get('data')?.setValue(null)
      return
    }

    this.simpleForm.get('data')?.enable()
    this.simpleForm.get('data')?.setValue(null)

    if ($event == 1) {
      this.tipo_acto = 'de nomeação'

    } else if ($event == 2) {
      this.tipo_acto = 'de exoneração'
    }
  }

  selecionarOrgaoOuComandoProvincial(): void {
    // if (!$event) return

    const opcoes = {
      orgao_comando_provincial: 'Órgão'
    }
    this.direcaoOuOrgaoService.listarTodos(opcoes)
      .pipe(
        finalize((): void => {
        })
      )
      .subscribe((response: any): void => {
        this.direcaoOuOrgao = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
      })
  }

  public get getPessoaId() {
    return this.params.getId as number ?? this.params.getInfo as number
  }

  visualizar(documento: any) {

    const opcoes = {
      pessoaId: this.documento?.pessoafisica_id,
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

  public setItem(item: any) {
    if (!item) return
    this.documento = item
  }

  public limparItem() {
    this.documento = null

  }

  public get buscarId() {
    return this.documento?.id
  }
}
