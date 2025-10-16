import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { MobilidadeService } from '@resources/modules/sigpq/core/service/Mobilidade.service';
import { Pagination } from '@shared/models/pagination';
import { DepartamentoService } from '@shared/services/config/Departamento.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { SeccaoService } from '@shared/services/config/Seccao.service';
import { Select2OptionData } from 'ng-select2';
import { finalize, first } from 'rxjs';
import { FicheiroService } from '../../../../../../../core/services/Ficheiro.service';

const COLOCACAO_ORGAO = 'Orgão';
@Component({
  selector: 'sigpq-funcionario-colocao',
  templateUrl: './funcionario-colocao.component.html',
  styleUrls: ['./funcionario-colocao.component.css'],
})
export class FuncionarioColocaoComponent implements OnInit {
  public simpleForm: any;
  updateDataForm: any;
  public carregando: boolean = false;
  public submitted: boolean = false;
  totalBase: number = 0;
  public pagination = new Pagination();
  public documento: any;
  public fileUrl: any;
  public id: number | null = null;
  @Input() public params: any;
  @Input() public options: any;

  public filtro = {
    page: 1,
    perPage: 5,
    search: '',
  };

  public departamentos: Array<Select2OptionData> = [];
  public seccoes: Array<Select2OptionData> = [];
  public unidades: Array<Select2OptionData> = [];
  public orgaos: Array<Select2OptionData> = [];

  public departamentos_anterior: Array<Select2OptionData> = [];
  public seccoes_anterior: Array<Select2OptionData> = [];
  public unidades_anterior: Array<Select2OptionData> = [];
  public orgaos_anterior: Array<Select2OptionData> = [];

  public mobilidades: any = [];

  public colocaoOrgao: boolean = false;

  @Input() public orgaoOuComandoProvincial: any;
  public validarDataInicial = this.formatarDataHelper.getPreviousDate(
    0,
    0,
    0,
    'yyyy-MM-dd'
  );

  @Input() emTempo: any = null;

  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public validarDataAdesao = this.formatarDataHelper.getPreviousDate(
    0,
    0,
    0,
    'yyyy-MM-dd'
  );
  // modelos: Array<Select2OptionData> = []

  constructor(
    private fb: FormBuilder,
    private mobilidadeService: MobilidadeService,
    private formatarDataHelper: FormatarDataHelper,
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private funcionarioService: FuncionarioService,

    private departamentoService: DepartamentoService,
    private seccaoService: SeccaoService,
    private estruturaOrganicaServico: TipoEstruturaOrganica,
    private ficheiroService: FicheiroService
  ) {}
  ngOnInit(): void {
    this.criarForm();
    this.buscarMobilidade();
    this.buscarTipoEstruturaOrganica();
    this.selecionarOrgaoOuComandoProvincial();

    if (this.params?.getId || this.params?.getInfo) {
      this.criarForm();

      if (this.params?.getId || this.params?.getInfo) {
        this.buscarUmFuncionario();
      }
    }
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

  buscarUmFuncionario() {
    this.funcionarioService
      .buscarUm(this.params.getId || this.params.getInfo)
      .pipe(
        first(),
        finalize(() => {})
      )
      .subscribe({
        next: (response: any) => {},
      });
  }

  public formatDate(data: any) {
    return this.formatarDataHelper.formatDate(data);
  }

  public handlerCollapse($evt: any) {
    const collapse: any = document.querySelector(`#${$evt}`);
    const faInput: any = collapse.querySelector('.fa-1');
    if (faInput) {
      faInput.classList.toggle('fa-plus');
      faInput.classList.toggle('fa-minus');
    }
  }

  public criarForm() {
    this.simpleForm = this.fb.group({
      agentes_id: [this.getPessoaId, Validators.required],
      numero_despacho: [null, [Validators.required]],
      pessoajuridicaPassadoId: [null, [Validators.required]],
      departamentoPassadoId: [null],
      unidadePassadoId: [null],
      seccaoPassadoId: [null],
      data_ingresso: [null, [Validators.required]],
      // numero_ordem: [null, [Validators.required]],
      anexo: [null],
      ordenante: ['Gil Sebastião Famoso'],
      unidade_id: [null],
      departamento_id: [null],
      numero_guia: [null, Validators.required],
      seccao_id: [null],
      // data_ordem: [null, [Validators.required]],
      data_despacho: [null, [Validators.required]],
      situacao: ['anterior', Validators.required],
      orgao_anterior_id: [null],
      orgao_destino_id: [null, [Validators.required]],
      unidade_anterior: [null],
      seccao_anterior: [null],
      brigada_anterior: [null],
      seccao: [null],
      brigada: [null],
    });

    this.updateDataForm = this.fb.group({
      numero_despacho: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+$')],
      ],
      despacho_data: ['', [Validators.required]],
      numero_guia: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      guia_data: ['', [Validators.required]],
    });
  }

  uploadFile(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0];
    this.simpleForm.get(campo)?.setValue(file);
    this.simpleForm.get(campo)?.updateValueAndValidity();
  }

  onSubmit() {
    // if (this.simpleForm.invalid || this.submitted) {
    //   return;
    // }

    this.carregando = true;
    this.submitted = true;

    const data = this.getFormDados;

    const type = this.getId
      ? this.mobilidadeService.editar(this.getId, data)
      : this.mobilidadeService.registar(data);
    type
      .pipe(
        finalize(() => {
          this.carregando = false;
          this.submitted = false;
        })
      )
      .subscribe(() => {
        this.recarregarPagina();
        this.reiniciarFormulario();
      });
  }
  private get getFormDados() {
    const dados = new FormData();
    const orgaoDestinoId = this.simpleForm.get('orgao_destino_id')?.value;
    console.log(
      'Valor FINAL de orgao_destino_id antes de enviar:',
      orgaoDestinoId,
      typeof orgaoDestinoId
    );
    // if (
    //   !orgaoDestinoId ||
    //   isNaN(Number(orgaoDestinoId)) ||
    //   orgaoDestinoId === 'NaN' ||
    //   orgaoDestinoId === null ||
    //   orgaoDestinoId === undefined ||
    //   orgaoDestinoId === ''
    // ) {
    //   alert('Selecione uma Direção/Órgão válida antes de enviar!');
    //   throw new Error('Direção/Órgão inválida');
    // }
    dados.append('orgao_destino_id', String(orgaoDestinoId));
    dados.append('anexo', this.simpleForm.get('anexo')?.value);
    dados.append('despacho', this.simpleForm.get('numero_despacho')?.value);
    dados.append('data_ingresso', this.simpleForm.get('data_ingresso')?.value);
    dados.append('ordenante', this.simpleForm.get('ordenante')?.value);
    // dados.append('numero_ordem', this.simpleForm.get('numero_ordem')?.value)
    dados.append(
      'pessoajuridicaPassadoId',
      this.simpleForm.get('pessoajuridicaPassadoId')?.value
    );
    dados.append(
      'departamentoPassadoId',
      this.simpleForm.get('departamentoPassadoId')?.value
    );
    dados.append(
      'unidadePassadoId',
      this.simpleForm.get('unidadePassadoId')?.value
    );
    dados.append(
      'seccaoPassadoId',
      this.simpleForm.get('seccaoPassadoId')?.value
    );
    dados.append('unidade_id', this.simpleForm.get('unidade_id')?.value);
    dados.append('unidade_destino', this.simpleForm.get('unidade_destino')?.value);
    dados.append(
      'departamento_id',
      this.simpleForm.get('departamento_id')?.value
    );
    dados.append('seccao_id', this.simpleForm.get('seccao_id')?.value);
    dados.append('seccao_destino', this.simpleForm.get('seccao_destino')?.value);
    // dados.append('data_ordem', this.simpleForm.get('data_ordem')?.value)
    dados.append('numero_guia', this.simpleForm.get('numero_guia')?.value);
    dados.append('data_despacho', this.simpleForm.get('data_despacho')?.value);
    dados.append('situacao', this.simpleForm.get('situacao')?.value);

    return dados;
  }

  reiniciarFormulario() {
    this.simpleForm.reset();
    this.simpleForm.patchValue({
      pessoa_id: this.getPessoaId,
      situacao: ['anterior'],
    });

    $('#anexo-guia').val('');
    $('#anexo-ordem').val('');
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';

    this.buscarMobilidade();
  }

  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarMobilidade();
  }

  buscarMobilidade() {
    const options = {
      ...this.filtro,
      pessoafisica_id: this.getPessoaId,
    };
    this.mobilidadeService.listarPorPessoa(options).subscribe((response) => {
      console.log('Hoistorico de mobilidade representado:', response);
      this.mobilidades = response.data;

      this.totalBase = response.meta.current_page
        ? response.meta.current_page === 1
          ? 1
          : (response.meta.current_page - 1) * response.meta.per_page + 1
        : this.totalBase;

      this.pagination = this.pagination.deserialize(response.meta);
    });
  }

  public formatarGuia(guia: any) {
    return guia?.toString().trim();
  }

  public get getPessoaId(): any {
    return this.params.getId ?? this.params.getInfo;
  }

  // public selecionarPosicaoFuncao($event: any, idFimData: any): void {
  //   const element: HTMLDivElement = document.querySelector(`#${idFimData}`) as HTMLDivElement
  //   if ($event != SITUACAO_ACTUAL) {

  //     element.classList.remove('d-none')
  //     this.simpleForm.patchValue({
  //       data_colocacao_fim: null
  //     })
  //     this.simpleForm.get('data_colocacao_fim')?.setValidators(this.dataValidalitors)
  //     const dataInicio: HTMLDivElement = document.querySelector(`#data-inicio-colocacao`) as HTMLDivElement
  //     this.setDataInicial(dataInicio)

  //   } else if ($event == SITUACAO_ACTUAL) {
  //     element.classList.add('d-none')

  //   }
  // }

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
        this.orgaos_anterior = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome_completo,
        }));
        this.orgaos = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome_completo,
        }));
      });
  }

  // selecionarOrgaoOuComandoProvincial(): void {

  //    const opcoes = {
  //     orgao_comando_provincial: 'Órgão'
  //   }

  //   this.direcaoOuOrgaoService.listarTodos(opcoes)
  //     .pipe(
  //       finalize((): void => {

  //       })
  //     )
  //     .subscribe((response: any): void => {
  //       if ($type == 'anterior') {
  //         this.orgaos_anterior = []
  //         const org = response
  //           .filter((item: any) => !!item.id && !isNaN(item.id))
  //           .map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
  //         this.orgaos_anterior.push(...org)
  //       } else if ($type == 'actual') {
  //         this.orgaos = []
  //         const org = response
  //           .filter((item: any) => !!item.id && !isNaN(item.id))
  //           .map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
  //         this.orgaos.push(...org)
  //       }
  //     })

  // }

  // selecionarOrgaoOuComandoProvincial($event: any): void {

  //   const opcoes = {
  //     tipo_orgao: $event
  //   }
  //   this.direcaoOuOrgaoService.listarTodos(opcoes)
  //     .pipe(
  //       finalize((): void => {

  //       })
  //     )
  //     .subscribe((response: any): void => {
  //       this.direcaoOuOrgao = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
  //     })

  //   // if ($event == COLOCACAO_ORGAO) {
  //   //   this.colocaoOrgao = true
  //   //   this.simpleForm.get('provincia_id').enable()
  //   //   this.simpleForm.get('provincia_id')?.setValidators(this.dataValidalitors)
  //   // } else {
  //   //   this.colocaoOrgao = false
  //   //   this.simpleForm.get('provincia_id').setValue(null)
  //   //   this.simpleForm.get('provincia_id').disable()
  //   // }
  // }

  validarColocacao($event: any): void {
    // if (this.getId && this.edit) {
    //   if ($event == 1) {
    //     this.regimeTipo = true
    //     this.simpleForm.get('nip').enable()
    //   } else {
    //     this.regimeTipo = false
    //     this.simpleForm.get('nip').disable()
    //   }
    //   this.edit = false
    //   return
    // }
  }

  public get getId() {
    return this.id;
  }

  // Ao popular a lista de órgãos, garanta que todos os ids são numéricos
  private popularOrgaos(response: any[]) {
    this.orgaos = response
      .filter((item: any) => !!item.id && !isNaN(Number(item.id)))
      .map((item: any) => ({
        id: String(item.id),
        text: item.sigla + ' - ' + item.nome_completo,
      }));
  }

  // Exemplo de uso: this.popularOrgaos(response) ao receber os dados do serviço

  public selecionarDirecao($event: any, $type: any) {
    let valor = $event;
    if (
      valor &&
      typeof valor === 'object' &&
      valor.id &&
      !isNaN(Number(valor.id))
    ) {
      valor = String(valor.id);
    }
    if (
      valor &&
      !isNaN(Number(valor)) &&
      valor !== 'NaN' &&
      valor !== null &&
      valor !== undefined &&
      valor !== ''
    ) {
      valor = String(valor);
      console.log('Direção/Órgão selecionado (id):', valor);
      this.simpleForm.get('orgao_destino_id').setValue(valor);
      this.buscarUnidade(valor, $type);
      this.buscarDepartamento(valor, $type);
    } else {
      // alert('Selecione uma Direção/Órgão válida!');
      this.simpleForm.get('orgao_destino_id').setValue(null);
    }
  }
  public buscarUnidade($event: any, $type: any) {
    if (!$event) return;
    const opcoes = {
      pessoajuridica_id: $event,
      entidade: 'Unidade',
    };
    this.departamentoService
      .listarTodos(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (response: any) => {
          if ($type == 'anterior') {
            this.unidades_anterior = response.map((item: any) => ({
              id: item.id,
              text: item.sigla + ' - ' + item.nome_completo,
            }));
          } else if ($type == 'actual') {
            this.unidades = response.map((item: any) => ({
              id: item.id,
              text: item.sigla + ' - ' + item.nome_completo,
            }));
          }
        },
      });
  }
  public buscarDepartamento($event: any, $type: any) {
    if (!$event) return;

    const opcoes = {
      pessoajuridica_id: $event,
    };
    this.departamentoService
      .listarTodos(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (response: any) => {
          if ($type == 'anterior') {
            this.departamentos_anterior = response.map((item: any) => ({
              id: item.id,
              text: item.sigla + ' - ' + item.nome_completo,
            }));
          } else if ($type == 'actual') {
            this.departamentos = response.map((item: any) => ({
              id: item.id,
              text: item.sigla + ' - ' + item.nome_completo,
            }));
          }
        },
      });
  }
  public selecionarDepartamento($event: any, $type: any) {
    this.seccoes = [];
    if (!$event) return;
    const opcoes = {
      departamentoId: $event,
    };
    this.seccaoService
      .listarTodos(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (response: any) => {
          if ($type == 'anterior') {
            this.seccoes_anterior = response.map((item: any) => ({
              id: item.id,
              text: item.sigla + ' - ' + item.nome_completo,
            }));
          } else if ($type == 'actual') {
            this.seccoes = response.map((item: any) => ({
              id: item.id,
              text: item.sigla + ' - ' + item.nome_completo,
            }));
          }
        },
      });
  }
  carregarDocumento: boolean = false;

  visualizar(documento: any) {
    const opcoes = {
      pessoaId: documento.pessoa_id,
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
      .subscribe((file: any) => {
        this.fileUrl = this.ficheiroService.createImageBlob(file);
      });

    return true;
  }

  zerarFormularioAtualziacao(): void {
    this.updateDataForm.reset();
  }

  _mobilidadeSelecionado: any;
  public mobilidadeSelecionado(mobilidade: any) {
    this._mobilidadeSelecionado = mobilidade;
  }

  atualizarDados(): void {
    if (this.updateDataForm.valid) {
      let dadosAtualizados = this.updateDataForm.value;
      dadosAtualizados.despacho = this._mobilidadeSelecionado.despacho;
      dadosAtualizados.numero_guia = this._mobilidadeSelecionado.numero_guia;
      this.mobilidadeService
        .atualizar_data_mobilidade(
          dadosAtualizados,
          this._mobilidadeSelecionado.id
        )
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
      //this.updateDataForm.reset();
    } else {
      console.error('Formulário inválido!');
    }
  }
}
