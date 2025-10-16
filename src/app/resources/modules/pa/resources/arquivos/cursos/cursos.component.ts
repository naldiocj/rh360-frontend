import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { CursoService } from '@core/services/config/Curso.service';
import { CursoFuncionarioService } from '@resources/modules/sigpq/core/service/Curso-Funcionario.service';

import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import { AgenteService } from '../../../core/service/agente.service';

@Component({
  selector: 'sigpq-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {

  public simpleForm: any
  @Input() public params: any
  @Input() public options: any
  public totalBase: number = 0
  public pagination: Pagination = new Pagination()
  public cursos: any = []
  private curso: any = null
  public documento: any = null
  public documentosFile: any = []
  public fileUrl: any
  public carregarDocumento: boolean = false
  public submitted: boolean = false
  public isLoading: boolean = false

  public filtro = {
    page: 1,
    perPage: 5,
    search: '',


  }
  public id: any
  tipoCursoAgentes: any = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'Formação Técnico Policial', text: "FORMAÇÃO TÉCNICO POLICIAL" },
    { id: 'Formação Acadêmica', text: "FORMAÇÃO ACADÊMICA" },
    { id: 'Outras Formações', text: "OUTRAS FORMAÇÕES" },
  ]

  public tipoCursos: Array<Select2OptionData> = []

  public formatAccept = ['.pdf']


  constructor(
    private fb: FormBuilder,
    public formatarDataHelper: FormatarDataHelper,
    private ficheiroService: FicheiroService,
    private tipoCursoService: CursoService,
    private cursoFuncionariosService: CursoFuncionarioService,
    private agenteService: AgenteService,

  ) { }
  ngOnInit(): void {
    this.criarForm()
    this.buscarCursos()

  }

  private buscarTipoCurso(tipo: any = null): void {
    const opcoes = {
      tipo: tipo
    }
    this.tipoCursoService.listarTodos(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.tipoCursos = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })
  }

  public handleTipoCurso($event: any) {
    if (!$event)
      return

    this.buscarTipoCurso($event)
  }


  public uploadFile(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0]
    this.simpleForm.get(campo)?.setValue(file);
    this.simpleForm.get(campo)?.updateValueAndValidity();
  }

  public onSubmit() {

    if (this.simpleForm.invalid || this.submitted && !this.getPessoaId) {
      return
    }

    const dados = this.getDado
    const type = this.buscarId ? this.cursoFuncionariosService.editar(dados, this.buscarId) : this.cursoFuncionariosService.registar(dados)

    type.pipe(
      finalize(() => {
        this.isLoading = false;
        this.submitted = false;
      })
    ).subscribe({
      next: () => {
        this.reiniciarFormulario()
        this.recarregarPagina()
        this.limparItem()
      }
    })



  }


  private get getDado() {
    const formData = new FormData()
    formData.append('sigpq_tipo_curso_id', this.simpleForm.value.sigpq_tipo_curso_id)
    formData.append('pessoafisica_id', this.simpleForm.value.pessoafisica_id)
    formData.append('nid', this.simpleForm.value.nid)
    formData.append('anexo', this.simpleForm.value.anexo)
    return formData
  }


  public reiniciarFormulario = () => {
    this.simpleForm.reset()
    this.simpleForm.patchValue({
      pessoafisica_id: this.getPessoaId
    })
    $('#anexo-curso').val('')
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5
    this.filtro.search = ''

    this.buscarCursos()
  }



  public filtrarPagina(key: any, $e: any) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }

    this.buscarCursos()

  }

  private buscarCursos() {
    if (!this.getPessoaId) return

    this.cursoFuncionariosService.listar({ ...this.filtro, pessoafisica_id: this.getPessoaId }).pipe(
      finalize(() => {
        this.carregarDocumento = false
      })
    )
      .subscribe((response) => {


        this.cursos = response.data

        console.log("Cursos:",this.cursos)

        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);

      })

  }

  visualizar(documento: any) {

    console.log("Documentos:",documento)
    if (!documento) return

    const opcoes = {
      pessoaId: documento?.pessoafisica_id,
      url: documento?.anexo
    }

    this.fileUrl = null

    // if (['Pessoal', 'Profissional'].includes(documento.nid)) {
    //   opcoes.url = documento.anexo || null
    // } else {
    //   const documentoAux = this.documentosFile.find((f: any) => f.sigpq_tipo_documento_id == documento.sigpq_tipo_documento_id)
    //   opcoes.url = documentoAux.anexo
    // }

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
    //alert('Em construção')
  }

  public get getId() {
    return this?.id
  }
  get getPessoaId(): any {
    return this.agenteService?.id;
  }

  private criarForm() {
    this.simpleForm = this.fb.group({
      sigpq_tipo_curso_id: ['', Validators.required],
      anexo: [''],
      nid: [''],
      pessoafisica_id: [this.getPessoaId, Validators.required]
    })
  }

  public setItem(item: any) {
    if (!item) return
    this.curso = item;
    this.buscarTipoCurso(item?.tipo)

    if (item?.anexo) {
      $('#text_').css('color', 'green').text('Contem arquivo*')
    } else {
      $('#text_').css('color', 'red').text('Não contem arquivo*')
    }


    this.simpleForm.patchValue({
      sigpq_tipo_curso_id: item?.sigpq_tipo_curso_id,
      anexo: item?.anexo,
      nid: item?.tipo,
      pessoafisica_id: this.getPessoaId
    })
  }

  public limparItem() {
    this.curso = null
    $('#text_').css('color', 'none').text('')
  }

  public get buscarId() {
    return this.curso?.id
  }

}
