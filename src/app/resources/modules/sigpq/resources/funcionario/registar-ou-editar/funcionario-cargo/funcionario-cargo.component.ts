import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { PatenteService } from '@core/services/Patente.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { CargosService } from '@resources/modules/sigpq/core/service/Cargos.service';

import { TipoCargoService } from '@resources/modules/sigpq/core/service/Tipo-cargo.service';
import { ActoNomeacaoService } from '@resources/modules/sigpq/core/service/config/Acto-Nomeacao.service';
import { TipoCarreiraOuCategoriaService } from '@resources/modules/sigpq/core/service/config/Tipo-carreira-ou-categoria.service';
import { Pagination } from '@shared/models/pagination';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'sigpq-funcionario-cargo',
  templateUrl: './funcionario-cargo.component.html',
  styleUrls: ['./funcionario-cargo.component.css'],
})
export class FuncionarioCargoComponent implements OnInit {
  public simpleForm: any;
  public carregando: boolean = false;
  public totalBase: number = 0;
  public pagination: Pagination = new Pagination();
  public fileUrl: any;
  public documento: any;
  public carregarDocumento: boolean = false;
  updateDespachoForm: any;

  @Input() public pessoaId: any;
  @Input() public options: any;
  @Input() public params: any;
  public cargos: any = [];

  public submitted: boolean = false;

  public id: any = null;
  public tipo_acto: string | null = null;
  public filtro = {
    page: 1,
    perPage: 5,
    search: '',
  };

  public validarDataAdesao = this.formatarDataHelper.getPreviousDate(
    0,
    0,
    0,
    'yyyy-MM-dd'
  );

  public tipoNomeacaoExoneracao: Array<Select2OptionData> = [];
  @Input() public orgaoOuComandoProvincial: any;
  public validarDataInicial = this.formatarDataHelper.getPreviousDate(
    0,
    0,
    0,
    'yyyy-MM-dd'
  );
  public tipoCarreiraOuCategorias: Array<Select2OptionData> = [];
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public tipoCarreiraOuCategorias_: Array<Select2OptionData> = [];
  public funcionario: any = null;

  ngOnInit(): void {
    this.createForm();
    this.buscarTipoCargo();
    this.buscarNomeacao();
    if (this.isEdittingMode()) {
      this.buscarCargos2();
    }
    this.buscarFuncionario();
    this.buscarTipoEstruturaOrganica();
    this.selecionarOrgaoOuComandoProvincial();
  }

  private buscarNomeacao() {
    this.actoNomeacaoService
      .listar({})
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.tipoNomeacaoExoneracao = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }
  private buscarTipoEstruturaOrganica() {
    this.estruturaOrganicaServico
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.tipoEstruturaOrganicas = response.map((item: any) => ({
          id: item.sigla,
          text: item.name,
        }));
      });
  }
  public handlerCollapse($evt: any) {
    const collapse: any = document.querySelector(`#${$evt}`);
    const faInput: any = collapse.querySelector('.fa-1');

    if (faInput) {
      faInput.classList.toggle('fa-plus');
      faInput.classList.toggle('fa-minus');
    }
  }

  @Input() emTempo: any = null;

  public patentes: Array<Select2OptionData> = [];
  public actoProgressaos: Array<Select2OptionData> = [];
  public direcaoOuOrgao: Array<Select2OptionData> = [];
  public tipoCargos: Array<Select2OptionData> = [];

  constructor(
    private fb: FormBuilder,
    private patenteService: PatenteService,
    public formatarDataHelper: FormatarDataHelper,
    private tipoCargoService: TipoCargoService,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private actoNomeacaoService: ActoNomeacaoService,
    private cargoServive: CargosService,
    private ficheiroService: FicheiroService,
    private funcionarioService: FuncionarioService,
    private tipoCarreiraOuCategoriaService: TipoCarreiraOuCategoriaService,
    private estruturaOrganicaServico: TipoEstruturaOrganica
  ) {}

  public createForm() {
    this.simpleForm = this.fb.group({
      patente_id: [null, Validators.required],
      // numero_ordem_nomeacao: [null, Validators.required],
      // data_ordem_nomeacao: [null, Validators.required],
      tipo_orgao: [null, Validators.required],
      numero_despacho_nomeacao: [null, Validators.required],
      data_despacho_nomeacao: [null, Validators.required],
      sigpq_tipo_categoria_id: [null, Validators.required],
      situacao: ['exercída', Validators.required],
      sigpq_acto_nomeacao_id: [null, [Validators.required]],
      pessoajuridica_id: [null, [Validators.required]],
      sigpq_tipo_cargo_id: [null, Validators.required],
      // data: [null, [Validators.required]],
      anexo_nomeacao: [null, [Validators.required]],
      pessoafisica_id: [this.getPessoaId, Validators.required],
    });

    this.updateDespachoForm = this.fb.group({
      numero_despacho: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      despacho_data: ['', Validators.required],
    });
  }

  private get formData() {
    const data = new FormData();
    data.append('patente_id', this.simpleForm.get('patente_id')?.value);
    // data.append('numero_ordem_nomeacao', this.simpleForm.get('numero_ordem_nomeacao')?.value)
    data.append(
      'numero_despacho_nomeacao',
      this.simpleForm.get('numero_despacho_nomeacao')?.value
    );
    // data.append('data_ordem_nomeacao', this.simpleForm.get('data_ordem_nomeacao')?.value)
    data.append(
      'data_despacho_nomeacao',
      this.simpleForm.get('data_despacho_nomeacao')?.value
    );
    data.append('situacao', this.simpleForm.get('situacao')?.value);
    data.append(
      'sigpq_acto_nomeacao_id',
      this.simpleForm.get('sigpq_acto_nomeacao_id')?.value
    );
    data.append(
      'pessoajuridica_id',
      this.simpleForm.get('pessoajuridica_id')?.value
    );
    data.append(
      'sigpq_tipo_cargo_id',
      this.simpleForm.get('sigpq_tipo_cargo_id')?.value
    );
    // data.append('data', this.simpleForm.get('data')?.value)
    data.append('anexo_nomeacao', this.simpleForm.get('anexo_nomeacao')?.value);
    data.append(
      'pessoafisica_id',
      this.simpleForm.get('pessoafisica_id')?.value
    );

    return data;
  }

  public formatDate(data: any): any {
    return this.formatarDataHelper.formatDate(data);
  }

  buscarPatente(): void {
    this.patenteService
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.patentes = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }

  private buscarCargos2() {
    const opcoes = {...this.filtro, pessoafisicaId: this.getPessoaId}
    this.cargoServive
      .listar(opcoes)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.cargos = response.data;

          this.totalBase = response.meta.current_page
            ? response.meta.current_page === 1
              ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;

          this.pagination = this.pagination.deserialize(response.meta);
        },
      });
  }

  private buscarCargos() {
    this.cargoServive
      .listar({ ...this.filtro, pessoafisicaId: this.getPessoaId })
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.cargos = response.data;

          this.totalBase = response.meta.current_page
            ? response.meta.current_page === 1
              ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;

          this.pagination = this.pagination.deserialize(response.meta);
        },
      });
  }
  private buscarTipoCarreiraOuCategoria(event: any): void {
    if (!event) return;

    const opcoes = {
      regime_id: event,
    };
    this.tipoCarreiraOuCategoriaService
      .listar(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.tipoCarreiraOuCategorias = response
          .filter(
            (item: any) =>
              item.nome.toUpperCase() !== 'Tesoureiro'.toUpperCase()
          )
          .map((item: any) => ({ id: item.id, text: item.nome }));
        this.tipoCarreiraOuCategorias_ = response;
      });
  }

  uploadFile(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0];
    this.simpleForm.get(campo)?.setValue(file);
    this.simpleForm.get(campo)?.updateValueAndValidity();
  }

  regime_do_agente: string = '1';
  private buscarFuncionario() {
    if (!this.getPessoaId) return;
    this.funcionarioService
      .buscarUm(this.getPessoaId)
      .pipe(
        finalize((): void => {
          this.buscarTipoCarreiraOuCategoria(this.funcionario?.regime_id);
          this.regime_do_agente = this.funcionario?.regime_id;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.funcionario = response;
        },
      });
  }

  _cargoSelecionado: any;
  public cargoSelecionado(cargo: any) {
    this._cargoSelecionado = cargo;
  }

  atualizarDespacho() {
    if (this.updateDespachoForm.valid) {
      const dadosDespacho = this.updateDespachoForm.value;
      this.cargoServive
        .atualizar_data_cargo(dadosDespacho, this._cargoSelecionado.id)
        .pipe(
          finalize(() => {
            this.carregando = false;
            this.submitted = false;
          })
        )
        .subscribe((response: any) => {
          this.recarregarPagina();
          this.reiniciarFormulario();
        });
    } else {
      console.error('O formulário está inválido!');
    }
  }

  zerarFormularioAtualizacao() {
    this.updateDespachoForm.reset();
  }

  public onSubmit() {
    if (this.simpleForm.invalid || this.submitted) return;

    this.carregando = true;
    this.submitted = true;

    const data = this.formData;

    const type = this.getId
      ? this.cargoServive.editar(this.getId, data)
      : this.cargoServive.registar(data);

    type
      .pipe(
        finalize(() => {
          this.carregando = false;
          this.submitted = false;
        })
      )
      .subscribe(() => {
        this.reiniciarFormulario();
        this.recarregarPagina();
      });
  }

  public recarregarPagina(): void {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    // this.buscarCargos()
  }

  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarCargos();
  }

  reiniciarFormulario() {
    this.simpleForm.reset();
    this.simpleForm.patchValue({
      pessoafisica_id: this.getPessoaId,
      situacao: ['exercída'],
    });
    $('#anexo_nomeacao').val('');
  }

  public get getId() {
    return this.id;
  }

  // buscarId(): number {
  //   return this.em_tempo?.id;
  // }

  buscarTipoCargo(): void {
    const opcoes = {};
    this.tipoCargoService
      .listar(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.tipoCargos = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }
  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  get getEmTempoPatenteId() {
    return this.emTempo?.patente_id;
  }

  public get buscarId(): any {
    return this.pessoaId;
  }

  public selecionarPosicaoFuncao($event: any): void {
    if (!$event) {
      this.simpleForm.get('data')?.disable();
      this.simpleForm.get('data')?.setValue(null);
      return;
    }

    this.simpleForm.get('data')?.enable();
    this.simpleForm.get('data')?.setValue(null);

    if ($event == 1) {
      this.tipo_acto = 'de nomeação';
    } else if ($event == 2) {
      this.tipo_acto = 'de exoneração';
    }
  }

  // private setDataInicial(elemento: HTMLDivElement) {
  //   const dataInicial: HTMLInputElement = elemento.querySelector('input[type="date"]') as HTMLInputElement
  //   dataInicial.max = this.validarDataInicial;

  // }

  // public dataInicialFim(evt: any, id_data: any) {
  //   const dataFinal: HTMLInputElement = document.querySelector(`#${id_data}`) as HTMLInputElement
  //   if (!dataFinal) return
  //   dataFinal.min = evt.target.value;
  //   dataFinal.value = evt.target.value;

  // }

  // private dataValidalitors = [
  //   Validators.required,
  // ]

  selecionarOrgaoOuComandoProvincial(): void {
    // if (!$event) return

    const opcoes = {
      orgao_comando_provincial: 'Órgão',
    };
    this.direcaoOuOrgaoService
      .listarTodos(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.direcaoOuOrgao = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome_completo,
        }));
      });
  }

  public get getPessoaId() {
    return (this.params.getId as number) ?? (this.params.getInfo as number);
  }

  private isEdittingMode() {
    return isNaN(this.params.getId) || this.params.getId === '' || this.params.getId === null ? false : true
  } 

  visualizar(documento: any) {
    const opcoes = {
      pessoaId: this.getId,
      url: '',
    };

    this.fileUrl = null;

    opcoes.url = documento.anexo || null;

    this.documento = documento;

    if (!opcoes.url) return false;

    this.carregarDocumento = true;
    this.ficheiroService
      .getFile(opcoes)
      .pipe(
        finalize(() => {
          this.carregarDocumento = false;
        })
      )
      .subscribe((file) => {
        this.fileUrl = this.ficheiroService.createImageBlob(file);
      });

    return true;
  }

  construcao() {
    alert('Em construção');
  }

  public validarClasse(evt: any = null, geral: boolean = false) {
    if (!evt && !geral) return;

    geral = evt >= 1 && evt <= 6 ? true : false;

    const options = {
      sigpq_tipo_carreira_id: evt,
      //tecnico: Number(geral)
    };

    this.patenteService
      .listar(options)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.patentes = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }
}
