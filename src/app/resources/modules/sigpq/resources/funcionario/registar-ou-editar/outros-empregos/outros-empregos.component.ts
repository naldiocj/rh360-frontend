import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { CursoService } from '@core/services/config/Curso.service';

import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import { EmpregasService } from '../../../../../../../core/services/config/Empregas.service';
import { OutrosEmpregosFuncionarioService } from '../../../../core/service/Outros-Empregos-Funcionario.service';

@Component({
  selector: 'sigpq-outros-empregos',
  templateUrl: './outros-empregos.component.html',
  styleUrls: ['./outros-empregos.component.css']
})
export class OutrosEmpregosComponent implements OnInit {

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
    tipo_formacao_id:'null',
  }
  public id: any
  listaEmpresas: Array<Select2OptionData> = [];
  listaEmpresas_pesquisa:Array<Select2OptionData> = [];
 tiposContrato:Array<Select2OptionData>=[]
 historico:any


  public formatAccept = ['.pdf']


  constructor(
    private fb: FormBuilder,
    public formatarDataHelper: FormatarDataHelper,
    private ficheiroService: FicheiroService,
    private listaEmpresaservice: CursoService,
    private outrosEmpregosFuncionariosService: OutrosEmpregosFuncionarioService,
    private listaEmpresasService: EmpregasService

  ) { }
  ngOnInit(): void {
    this.listarEmpresas()
    this.criarForm()
    this.carregarTipoContrato()
    this.buscarHistoricoDeEmpregos()
  }

  showModal(modalName:string) {
    const modal = document.getElementById(modalName);
    if (modal) {
      modal.style.display = 'block';

    }
  }

  closeModal(modalName:string) {
    const modal = document.getElementById(modalName);
    if (modal) {
      modal.style.display = 'none'; // Fecha o modal
    }
  }

  private buscarHistoricoDeEmpregos() {
    if (!this.getPessoaId) return
    this.outrosEmpregosFuncionariosService.listar({ ...this.filtrarFiltros(this.filtro), pessoafisica_id: this.getPessoaId }).pipe(
      finalize(() => {
        this.carregarDocumento = false
      })
    )
      .subscribe((response) => {

        this.historico = response.data
        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);

      })

  }

  carregarTipoContrato()
  {
    this.tiposContrato.push({ id: '1', text: 'Efectivo' })
    this.tiposContrato.push({ id: '2', text: 'Estagiário' })
    this.tiposContrato.push({ id: '3', text: 'Temporário' })
  }
  listarEmpresas() {
    const options = { };
    this.listaEmpresasService.listarTodos(options).pipe(
      finalize(() => {
      }),
    ).subscribe((response:any) => {
      this.listaEmpresas = [];
      this.listaEmpresas_pesquisa = [];
        this.listaEmpresas_pesquisa.push({
          id: 'null',
          text: 'Todos',
        });
        const aux = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
        }));

        this.listaEmpresas.push(...aux);
        this.listaEmpresas_pesquisa.push(...aux);
      //this.pagination = this.pagination.deserialize(response.meta);
    });
  }


  
  private buscarTipoCurso(tipo: any = null): void {
    const opcoes = {
      tipo_formacao_id: tipo
    }
    this.listaEmpresaservice.listarTodos(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.listaEmpresas = response.map((item: any) => ({ id: item.id, text: item.nome }))
      })
  }

  validateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, ''); // Permite somente números
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
    const type = this.buscarId ? this.outrosEmpregosFuncionariosService.editar(dados, this.buscarId) : this.outrosEmpregosFuncionariosService.registar(dados)

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

  getTipoContratoTexto(id: string): string | undefined {
    const tipo = this.tiposContrato.find(tipo => tipo.id === id);
    return tipo ? tipo.text : undefined;
  }
  
  private get getDado() {
    const formData = new FormData()
    formData.append('empresa_id', this.simpleForm.value.empresa_id)
    formData.append('empresa', this.simpleForm.value.empresa)
    formData.append('pessoafisica_id', this.simpleForm.value.pessoafisica_id)
    formData.append('cargo', this.simpleForm.value.cargo)
    formData.append('ano_inicio', this.simpleForm.value.ano_inicio)
    formData.append('ano_fim', this.simpleForm.value.ano_fim)
    formData.append('tipo_de_contrato', this.getTipoContratoTexto(this.simpleForm.value.tipo_de_contrato)??'Efectivo')
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
    this.buscarHistoricoDeEmpregos()
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



  }

  private  filtrarFiltros = (filtros:any) => {
    return Object.fromEntries(
        Object.entries(filtros).filter(([key, value]) => value !== undefined && value !== "")
    );
};

  

  visualizar(documento: any) {
    this.showModal("modalEmprego")
    if (!documento) return

    const opcoes = {
      pessoaId: documento?.pessoafisica_id,
      url: documento?.anexo
    }

    this.fileUrl = null

    // if (['Pessoal', 'Profissional'].includes(documento.cargo)) {
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
  public get getPessoaId(): number {
    return this.params?.getInfo as number ?? this.params?.getId as number
  }

  private criarForm() {
    this.simpleForm = this.fb.group({
      empresa_id: [null],
      empresa: ['', Validators.required],
      anexo: [''],
      ano_inicio: ['', [
        Validators.pattern(/^\d+$/), // Aceita apenas números
        Validators.minLength(4), // Mínimo de 4 dígitos
        Validators.maxLength(4), // Máximo de 4 dígitos
      ]],ano_fim: ['', [
        Validators.pattern(/^\d+$/), // Aceita apenas números
        Validators.minLength(4), // Mínimo de 4 dígitos
        Validators.maxLength(4), // Máximo de 4 dígitos
      ]],
      cargo: [''],
      tipo_de_contrato:[''],
      pessoafisica_id: [this.getPessoaId, Validators.required]
    })
  }

  getTipoContratoId(texto: string): string | undefined {
    const tipo = this.tiposContrato.find(tipo => tipo.text.toLowerCase() === texto.toLowerCase());
    return tipo ? tipo.id : undefined;
  }
  
  public async setItem(item: any) {
    if (!item) return
    this.curso = item;
    //this.buscarTipoCurso(item?.id)
     console.log("EMPREGO SELECIONADO:",item)
    if (item?.anexo) {
      $('#text_').css('color', 'green').text('Contem arquivo*')
    } else {
      $('#text_').css('color', 'red').text('Não contem arquivo*')
    }

   //await this.handleTipoCurso(item?.tipo_id)
    this.simpleForm.patchValue({
      empresa_id: item?.empresa_id,
      anexo: item?.anexo,
      tipo_de_contrato: this.getTipoContratoId(item?.tipo_de_contrato),
      ano_inicio: item?.ano_inicio,
      ano_fim: item?.ano_fim,
      cargo: item?.cargo,
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
