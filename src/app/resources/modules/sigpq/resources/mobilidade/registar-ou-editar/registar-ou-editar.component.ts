import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { first, takeUntil } from 'rxjs/operators';
import { finalize, Subject } from 'rxjs';

import { FuncionarioValidation } from '@resources/modules/sigpq/shared/validation/funcionario.validation';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { MobilidadeService } from '@resources/modules/sigpq/core/service/Mobilidade.service';
import { TipoEstruturaOrganica } from '@core/services/config/TipoEstruturaOrganica.service';
import { SeccaoService } from '@shared/services/config/Seccao.service';
import { DepartamentoService } from '@shared/services/config/Departamento.service';
import { UnidadeService } from '@shared/services/config/Unidade.service';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { Pagination } from '@shared/models/pagination';
import { AuthService } from '@core/authentication/auth.service';

@Component({
  selector: 'app-sigpq-mobilidade-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css'],
})
export class RegistarOuEditarComponent implements OnInit {
  @Output() eventRegistarOuEditModel = new EventEmitter<boolean>();
  @Input() agentesId: any;
  @Input() numeroGuia: any;
  public mobilidade: any = null;

  private destroy$ = new Subject<void>();

  data: any = [
    { id: 1, text: `Orgão central` },
    { id: 2, text: `Orgao provincial` },
  ];

  public tipoOrgaos: Array<Select2OptionData> = [];
  public orgaos: Array<Select2OptionData> = [];

  public departamentos: Array<Select2OptionData> = [];
  public seccoes: Array<Select2OptionData> = [];
  public unidades: Array<Select2OptionData> = [];
  public tipoEstruturaOrganicas: Array<Select2OptionData> = [];
  public brigadas: Array<Select2OptionData> = [];
  public validarDataAdesao = this.formatarDataHelper.getPreviousDate(
    0,
    0,
    0,
    'yyyy-MM-dd'
  );

  simpleForm: any;

  isLoading: boolean = false;
  submitted: boolean = false;

  updateDataForm: any;
  public carregando: boolean = false;
  totalBase: number = 0;
  public pagination = new Pagination();
  public documento: any;
  public fileUrl: any;
  public id: number | null = null;

  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: 'null', text: 'Selecione uma opção' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
    { id: 'Orgão', text: 'Orgão Central' },
  ];

  formErrors: any;

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
    search: '',
    dashboard: false,
  };

  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  public departamentos_anterior: Array<Select2OptionData> = [];
  public seccoes_anterior: Array<Select2OptionData> = [];
  public unidades_anterior: Array<Select2OptionData> = [];
  public orgaos_anterior: Array<Select2OptionData> = [];

  public mobilidades: any = [];

  public colocaoOrgao: boolean = false;

  public validarDataInicial = this.formatarDataHelper.getPreviousDate(
    0,
    0,
    0,
    'yyyy-MM-dd'
  );

  @Input() emTempo: any = null;

  carregarDocumento: boolean = false;

  public validarDataNascimento = this.formatarDataHelper.getPreviousDate(
    0,
    0,
    0,
    'yyyy-MM-dd'
  );

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
    private unidadeService: UnidadeService,
    private funcionarioService: FuncionarioService,
    private ficheiroService: FicheiroService,
    private authService: AuthService
  ) {
    this.criarForm();
    this.buscarMobilidade();
    this.buscarTipoEstruturaOrganica();
    this.selecionarOrgaoOuComandoProvincial();

    if (
      this.activatedRoute.snapshot.params['getId'] ||
      this.activatedRoute.snapshot.params['getInfo']
    ) {
      this.criarForm();

      if (
        this.activatedRoute.snapshot.params['getId'] ||
        this.activatedRoute.snapshot.params['getInfo']
      ) {
        this.buscarUmFuncionario();
      }
    }
  }

  buscarUmFuncionario() {
    this.funcionarioService
      .buscarUm(
        this.activatedRoute.snapshot.params['getId'] ||
          this.activatedRoute.snapshot.params['getInfo']
      )
      .pipe(
        first(),
        finalize(() => {})
      )
      .subscribe({
        next: (response: any) => {},
      });
  }

  ngOnInit(): void {
    this.buscarTipoEstruturaOrganica();

  }

  public formatarGuia(guia: any) {
    return guia?.toString().trim();
  }

  public get getPessoaId(): any {
    return (
      this.activatedRoute.snapshot.params['getId'] ??
      this.activatedRoute.snapshot.params['getInfo']
    );
  }

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

  reiniciarFormulario() {
    this.simpleForm.reset();
    this.simpleForm.patchValue({
      pessoa_id: this.getPessoaId,
      situacao: ['anterior'],
    });

    $('#anexo-guia').val('');
    $('#anexo-ordem').val('');
  }

  _mobilidadeSelecionado: any;
  public mobilidadeSelecionado(mobilidade: any) {
    this._mobilidadeSelecionado = mobilidade;
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

  public selecionarOrgaoOuComandoProvincial(): void {
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

  buscarBrigada($e: any) {
    if (!$e) return;

    const options = { seccaoId: $e };

    this.unidadeService
      .listarTodos(options)
      .pipe(finalize(() => {}))
      .subscribe((response) => {
        this.brigadas = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome_completo,
        }));
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

  public selecionarDirecao($event: any, $type: any) {
    let valor = $event;

    // alert(JSON.stringify(this.simpleForm.get('orgao_destino_id')?.value));

    this.buscarDepartamento(valor, $type);
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

  public get getId() {
    return this.activatedRoute.snapshot.params['id'] as number;
  }

  public criarForm() {
    this.simpleForm = this.fb.group({
      agentes_id: [this.getPessoaId, Validators.required],
      numero_despacho: [null, [Validators.required]],
      // pessoajuridicaPassadoId: [null, [Validators.required]],
      // departamentoPassadoId: [null],
      // unidadePassadoId: [null],
      // seccaoPassadoId: [null],
      data_ingresso: [null, [Validators.required]],
      // numero_ordem: [null, [Validators.required]],
      anexo: [null],
      // ordenante: ['Gil Sebastião Famoso'],
      // unidade_id: [null],
      departamento_id: [null],
      numero_guia: [null, Validators.required],
      // seccao_id: [null],
      // data_ordem: [null, [Validators.required]],
      despacho_data: [null, [Validators.required]],
      situacao: ['anterior', Validators.required],
      // orgao_anterior_id: [null],
      orgao_destino_id: [null, [Validators.required]],
      // unidade_anterior: [null],
      // seccao_anterior: [null],
      // brigada_anterior: [null],
      direccao_destino_id: [null],
      seccao: [null],
      brigada: [null],
    });

    this.updateDataForm = this.fb.group({
      numero_despacho: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+$')],
      ],
      numero_guia: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      guia_data: ['', [Validators.required]],
    });
  }

  uploadFile(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0];
    this.simpleForm.get(campo)?.setValue(file);
    this.simpleForm.get(campo)?.updateValueAndValidity();
  }

  // selecionarOrgaoOuComandoProvincial($event: any): void {

  //   const opcoes = {
  //     tipo_estrutura_sigla: $event
  //   }
  //   this.direcaoOuOrgaoService.listarTodos(opcoes)
  //     .pipe(
  //       finalize((): void => {

  //       })
  //     )
  //     .subscribe((response: any): void => {
  //       this.orgaos = []
  //       const org = response.map((item: any) => ({ id: item.id, text: item.sigla + ' - ' + item.nome_completo }))
  //       this.orgaos.push(...org)
  //     })

  // }

  onSubmit() {
    // alert("aqui")
    // if (this.simpleForm.invalid || this.submitted) {
    //   return;
    // }

    this.submitted = true;
    this.isLoading = true;

    // this.simpleForm.value.agentes_id = this.agentesId.map(
    //   (agente: any) => agente.id
    // );

    console.log('Agentes ID recebidos no componente:', this.agentesId);


    const form = this.getFormDados;

    const type = this.getId
      ? this.mobilidadeService.editar(this.getId, form)
      : this.mobilidadeService.registar(form);

    type
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.submitted = false;
        })
      )
      .subscribe((response) => {
        this.restaurarFormulario();
        this.removerModal();
        this.eventRegistarOuEditModel.emit(true);
      });
  }

  private removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  private gerarPDF(info: any) {
    console.log(info);
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

  get user_id() {
    return this.authService?.user?.id?.toString().toLowerCase();
  }

  private get getFormDados() {
    const dados = new FormData();

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

    // const formValue = this.simpleForm.getRawValue();

    let agentes_id = this.agentesId.map((agente: any) => agente.id).join(',');

    dados.append('user_id', String(this.user_id));
    dados.append('agentes_id', String(agentes_id));
    dados.append(
      'orgao_destino_id',
      this.simpleForm.get('orgao_destino_id')?.value
    );
    dados.append(
      'direccao_destino_id',
      this.simpleForm.get('direccao_destino_id')?.value
    );
    dados.append('anexo', this.simpleForm.get('anexo')?.value);
    dados.append('despacho', this.simpleForm.get('numero_despacho')?.value);
    dados.append('data_ingresso', this.simpleForm.get('data_ingresso')?.value);
    dados.append(
      'departamento_id',
      this.simpleForm.get('departamento_id')?.value
    );
    dados.append('numero_guia', this.simpleForm.get('numero_guia')?.value);
    dados.append('despacho_data', this.simpleForm.get('despacho_data')?.value);
    dados.append('situacao', 'actual');
    dados.append('seccao', this.simpleForm.get('seccao')?.value);
    dados.append('brigada', this.simpleForm.get('brigada')?.value);

    // dados.append('ordenante', this.simpleForm.get('ordenante')?.value);
    // dados.append('numero_ordem', this.simpleForm.get('numero_ordem')?.value)
    // dados.append(
    //   'pessoajuridica_passado_id',
    //   this.simpleForm.get('pessoajuridicaPassadoId')?.value
    // );
    // dados.append(
    //   'departamentoPassadoId',
    //   this.simpleForm.get('departamentoPassadoId')?.value
    // );
    // dados.append(
    //   'unidadePassadoId',
    //   this.simpleForm.get('unidadePassadoId')?.value
    // );
    // dados.append(
    //   'seccaoPassadoId',
    //   this.simpleForm.get('seccaoPassadoId')?.value
    // );
    // dados.append('unidade_id', this.simpleForm.get('unidade_id')?.value);
    // dados.append(
    //   'unidade_destino',
    //   this.simpleForm.get('unidade_destino')?.value
    // );
    // dados.append('seccao_id', this.simpleForm.get('seccao_id')?.value);

    // dados.append('data_ordem', this.simpleForm.get('data_ordem')?.value)

    // dados.append(
    //   'seccao_anterior',
    //   this.simpleForm.get('seccao_anterior')?.value
    // );
    // dados.append(
    //   'brigada_anterior',
    //   this.simpleForm.get('brigada_anterior')?.value
    // );
    

    return dados;
  }

  public getFormData(agente: any) {
    const dados = new FormData();

    console.log('7777777777777777-----Agente ID:', agente);

    return;

    // let agentes_id = [agente.id].map((id: any) => id).join(',');

    dados.append('user_id', String(this.user_id));
    // dados.append('agentes_id', String(agentes_id));
    dados.append(
      'orgao_destino_id',
      this.simpleForm.get('orgao_destino_id')?.value
    );
    dados.append(
      'direccao_destino_id',
      this.simpleForm.get('direccao_destino_id')?.value
    );
    dados.append('anexo', this.simpleForm.get('anexo')?.value);
    dados.append('despacho', this.simpleForm.get('numero_despacho')?.value);
    dados.append('data_ingresso', this.simpleForm.get('data_ingresso')?.value);
    // dados.append('ordenante', this.simpleForm.get('ordenante')?.value);
    // dados.append('numero_ordem', this.simpleForm.get('numero_ordem')?.value)
    dados.append(
      'pessoajuridica_passado_id',
      this.simpleForm.get('pessoajuridicaPassadoId')?.value
    );
    dados.append(
      'departamentoPassadoId',
      this.simpleForm.get('departamentoPassadoId')?.value
    );
    // dados.append(
    //   'unidadePassadoId',
    //   this.simpleForm.get('unidadePassadoId')?.value
    // );
    // dados.append(
    //   'seccaoPassadoId',
    //   this.simpleForm.get('seccaoPassadoId')?.value
    // );
    // dados.append('unidade_id', this.simpleForm.get('unidade_id')?.value);
    // dados.append(
    //   'unidade_destino',
    //   this.simpleForm.get('unidade_destino')?.value
    // );
    dados.append(
      'departamento_id',
      this.simpleForm.get('departamento_id')?.value
    );
    // dados.append('seccao_id', this.simpleForm.get('seccao_id')?.value);

    // dados.append('data_ordem', this.simpleForm.get('data_ordem')?.value)
    dados.append('numero_guia', this.simpleForm.get('numero_guia')?.value);
    dados.append('despacho_data', this.simpleForm.get('despacho_data')?.value);
    dados.append('situacao', 'actual');

    dados.append(
      'seccao_anterior',
      this.simpleForm.get('seccao_anterior')?.value
    );
    dados.append(
      'brigada_anterior',
      this.simpleForm.get('brigada_anterior')?.value
    );

    dados.append('seccao', this.simpleForm.get('seccao')?.value);
    dados.append('brigada', this.simpleForm.get('brigada')?.value);

    return dados;
  }

  restaurarFormulario() {
    this.simpleForm.reset();
    this.agentesId = [];
    this.simpleForm.value.agentes_id = [];
    this.simpleForm.get('anexo')?.setValue(null);
    this.simpleForm.patchValue({
      situacao: 'actual',
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  public selecionarSeccao($event: any) {
    // this.seccoes = []
    if (!$event) return;
    const opcoes = {
      departamentoId: $event,
    };
    this.seccaoService
      .listarTodos(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (response: any) => {
          this.brigadas = response.map((item: any) => ({
            id: item.id,
            text: item.sigla + ' - ' + item.nome_completo,
          }));
        },
      });
  }
}
