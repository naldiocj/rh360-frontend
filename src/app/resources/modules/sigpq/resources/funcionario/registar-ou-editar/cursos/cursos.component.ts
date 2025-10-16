import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { CursoService } from '@core/services/config/Curso.service';
import { CursoFuncionarioService } from '@resources/modules/sigpq/core/service/Curso-Funcionario.service';

import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import { InstituicaoDeEnsinoService } from '../../../../../../../core/services/config/InstituicaoDeEnsino';
import { TipoDeFormacaoService } from '../../../../../../../core/services/config/TipoDeFormacao';

@Component({
  selector: 'sigpq-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css'],
})
export class CursosComponent implements OnInit {
  public simpleForm: any;
  @Input() public params: any;
  @Input() public options: any;
  public totalBase: number = 0;
  public pagination: Pagination = new Pagination();
  public cursos: any = [];
  private curso: any = null;
  public documento: any = null;
  public documentosFile: any = [];
  public fileUrl: any;
  public carregarDocumento: boolean = false;
  public submitted: boolean = false;
  public isLoading: boolean = false;

  public filtro = {
    page: 1,
    perPage: 5,
    search: '',
    tipo_formacao_id: 'null',
  };
  public id: any;
  tipoDeFormacao: any;
  tipoDeFormacao_pesquisa: any;

  public tipoCursos: Array<Select2OptionData> = [];
  public tipoInstituicaoDeEnsino: Array<Select2OptionData> = [];

  public formatAccept = ['.pdf'];

  constructor(
    private fb: FormBuilder,
    public formatarDataHelper: FormatarDataHelper,
    private ficheiroService: FicheiroService,
    private tipoCursoService: CursoService,
    private cursoFuncionariosService: CursoFuncionarioService,
    private tipoDeFormacaoService: TipoDeFormacaoService,
    private instrituicaoDeEnsinoService: InstituicaoDeEnsinoService
  ) {}
  ngOnInit(): void {
    this.listarTipoDeFormacao();
    this.criarForm();
    this.buscarCursos();
    this.buscarTipoCurso2();
    this.listarInstrituicaoDeEnsino2();
  }

  listarTipoDeFormacao() {
    const options = {};
    this.tipoDeFormacaoService
      .listarTodos(options)
      .pipe(finalize(() => {}))
      .subscribe((response) => {
        this.tipoDeFormacao = [];
        this.tipoDeFormacao_pesquisa = [];
        this.tipoDeFormacao_pesquisa.push({
          id: 'null',
          text: 'Todos',
        });
        const aux = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));

        this.tipoDeFormacao.push(...aux);
        this.tipoDeFormacao_pesquisa.push(...aux);
        //this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  listarInstrituicaoDeEnsino($event: any) {
    const options = { tipo_formacao_id: $event };
    this.instrituicaoDeEnsinoService
      .listarTodos(options)
      .pipe(finalize(() => {}))
      .subscribe((response) => {
        this.tipoInstituicaoDeEnsino = [];
        const aux = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome.toUpperCase(),
        }));

        this.tipoInstituicaoDeEnsino.push(...aux);
        //this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  listarInstrituicaoDeEnsino2() {
    this.instrituicaoDeEnsinoService
      .listarTodos({})
      .pipe(finalize(() => {}))
      .subscribe((response) => {
        this.tipoInstituicaoDeEnsino = [];
        const aux = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome.toUpperCase(),
        }));

        this.tipoInstituicaoDeEnsino.push(...aux);
        //this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  private buscarTipoCurso(tipo: any = null): void {
    const opcoes = {
      tipo_formacao_id: tipo,
    };
    this.tipoCursoService
      .listarTodos(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.tipoCursos = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }

  private buscarTipoCurso2(): void {
    this.tipoCursoService
      .listarTodos({})
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.tipoCursos = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));
      });
  }

  validateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, ''); // Permite somente números
  }

  public handleTipoCurso($event: any) {
    if (!$event) return;

    this.buscarTipoCurso($event);
    this.listarInstrituicaoDeEnsino($event);
  }

  public uploadFile(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0];
    this.simpleForm.get(campo)?.setValue(file);
    this.simpleForm.get(campo)?.updateValueAndValidity();
  }

  public onSubmit() {

    // if (this.simpleForm.invalid || (this.submitted && !this.getPessoaId)) {
    //   return;
    // }

    const dados = this.getDado;
    const type = this.buscarId
      ? this.cursoFuncionariosService.editar(dados, this.buscarId)
      : this.cursoFuncionariosService.registar(dados);

    type
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.submitted = false;
        })
      )
      .subscribe({
        next: () => {
          this.reiniciarFormulario();
          this.recarregarPagina();
          this.limparItem();
        },
      });
  }

  private get getDado() {
    const formData = new FormData();
    formData.append(
      'sigpq_tipo_curso_id',
      this.simpleForm.value.sigpq_tipo_curso_id
    );
    formData.append('pessoafisica_id', this.simpleForm.value.pessoafisica_id);
    formData.append('nid', this.simpleForm.value.nid);
    formData.append(
      'ano_de_conclusao_do_curso',
      this.simpleForm.value.ano_de_conclusao_do_curso
    );
    formData.append(
      'instituicao_de_ensino_id',
      this.simpleForm.value.instituicao_de_ensino_id
    );
    formData.append('anexo', this.simpleForm.value.anexo);
    if (!this.buscarId) formData.append('activo', '1');
    return formData;
  }

  public reiniciarFormulario = () => {
    this.simpleForm.reset();
    this.simpleForm.patchValue({
      pessoafisica_id: this.getPessoaId,
    });
    $('#anexo-curso').val('');
  };

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.filtro.tipo_formacao_id = 'null';
    this.buscarCursos();
  }

  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    } else if (key == 'tipo') {
      this.filtro.tipo_formacao_id = $e;
    }

    this.buscarCursos();
  }

  private filtrarFiltros = (filtros: any) => {
    return Object.fromEntries(
      Object.entries(filtros).filter(
        ([key, value]) => value !== undefined && value !== ''
      )
    );
  };

  private buscarCursos() {
    if (!this.getPessoaId) return;
    this.cursoFuncionariosService
      .listar({
        ...this.filtrarFiltros(this.filtro),
        pessoafisica_id: this.getPessoaId,
      })
      .pipe(
        finalize(() => {
          this.carregarDocumento = false;
        })
      )
      .subscribe((response) => {
        this.cursos = response.data;

        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  visualizar(documento: any) {
    if (!documento) return;

    const opcoes = {
      pessoaId: documento?.pessoafisica_id,
      url: documento?.anexo,
    };

    this.fileUrl = null;

    // if (['Pessoal', 'Profissional'].includes(documento.nid)) {
    //   opcoes.url = documento.anexo || null
    // } else {
    //   const documentoAux = this.documentosFile.find((f: any) => f.sigpq_tipo_documento_id == documento.sigpq_tipo_documento_id)
    //   opcoes.url = documentoAux.anexo
    // }

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
    //alert('Em construção')
  }

  public get getId() {
    return this?.id;
  }
  public get getPessoaId(): number {
    return (this.params?.getInfo as number) ?? (this.params?.getId as number);
  }

  private criarForm() {
    this.simpleForm = this.fb.group({
      sigpq_tipo_curso_id: ['', Validators.required],
      anexo: [''],
      ano_de_conclusao_do_curso: [
        '',
        [
          Validators.pattern(/^\d+$/), // Aceita apenas números
          Validators.minLength(4), // Mínimo de 4 dígitos
          Validators.maxLength(4), // Máximo de 4 dígitos
        ],
      ],
      nid: [''],
      instituicao_de_ensino_id: [''],
      pessoafisica_id: [this.getPessoaId, Validators.required],
    });
  }

  public async setItem(item: any) {
    if (!item) return;
    this.curso = item;
    this.buscarTipoCurso(item?.tipo);

    if (item?.anexo) {
      $('#text_').css('color', 'green').text('Contem arquivo*');
    } else {
      $('#text_').css('color', 'red').text('Não contem arquivo*');
    }

    await this.handleTipoCurso(item?.tipo_id);
    this.simpleForm.patchValue({
      sigpq_tipo_curso_id: item?.sigpq_tipo_curso_id,
      anexo: item?.anexo,
      instituicao_de_ensino_id: item?.instituicao_de_ensino_id,
      ano_de_conclusao_do_curso: item?.ano_de_conclusao_do_curso,
      nid: item?.tipo_id,
      pessoafisica_id: this.getPessoaId,
    });
  }

  private get getDado_activo() {
    const formData = new FormData();
    formData.append('activo', '1');
    return formData;
  }

  setItemAprovar(item: any) {
    const dados = this.getDado_activo;
    const type = this.cursoFuncionariosService.activo(dados, item.id);

    type
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.submitted = false;
        })
      )
      .subscribe({
        next: () => {
          this.reiniciarFormulario();
          this.recarregarPagina();
          this.limparItem();
        },
      });
  }
  public limparItem() {
    this.curso = null;
    $('#text_').css('color', 'none').text('');
  }

  public get buscarId() {
    return this.curso?.id;
  }
}
