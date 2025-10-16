import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { AgregadoFamiliarService } from '@resources/modules/sigpq/core/service/Agregado-Familiar.service';
import { TipoFamiliarService } from '@resources/modules/sigpq/core/service/Tipo-familiar.service';
import { TipoDocumentoService } from '@resources/modules/sigpq/core/service/config/Tipo-documento.service';
import { Pagination } from '@shared/models/pagination';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'sigpq-funcionario-agregado-familiar',
  templateUrl: './funcionario-agregado-familiar.component.html',
  styleUrls: ['./funcionario-agregado-familiar.component.css']
})
export class FuncionarioAgregadoFamiliarComponent implements OnInit {

  public simpleForm: any
  public isLoading: any
  @Input() public params: any
  @Input() public options: any
  public agregadosFamiliares: any = []
  public agregadosFamiliar: any = []
  public agregadosFamiliarFile: any = []
  public totalBase: number = 0
  public documento: any
  public carregarDocumento: boolean = false;
  public fileUrl: any
  public pagination: Pagination = new Pagination()
  private id: any
  public filtro = {
    page: 1,
    perPage: 5,
    search: '',


  }
  tipoDocumentos: Array<Select2OptionData> = []
  tipoFamiliares: Array<Select2OptionData> = []

  public formatAccept = ['.pdf']

  tipoOutrosDados: Array<Select2OptionData> = []

  public submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private tipoFamiliarService: TipoFamiliarService,
    private tipoDocumentoService: TipoDocumentoService,
    private agregadoFamiliarService: AgregadoFamiliarService,
    private ficheiroService: FicheiroService,
    public formatarDataHelper: FormatarDataHelper) { }

  ngOnInit(): void {
    this.buscarTipoOutrosDados()
    this.criarForm()
    this.buscarTipoFamiliarService()
    this.buscarAgregadoFamiliares()

  }

  // public get getId() {
  //   return this.activatedRoute.snapshot.params["id"] as number
  // }

  buscarTipoOutrosDados(): void {
    const opcoes = {}
    this.tipoDocumentoService.listarTodos(opcoes)
      .pipe(
        finalize((): void => {

        })
      )
      .subscribe((response: any): void => {
        this.tipoOutrosDados = response.map((item: any) => ({ id: item.id, text: item.nome }))
        // somente BI e Boletim de nascimento
        this.tipoDocumentos = response.filter((item: any) => item.id == 1 || item.id == 9)
          .map((item: any) => ({ id: item.id, text: item.nome }))
      })
  }

  buscarTipoFamiliarService(): void {
    const opcoes = {}
    this.tipoFamiliarService.listar(opcoes)
      .pipe(
        finalize((): void => {
          this.tipoFamiliares = this.tipoFamiliares.filter((item: any) => {
            return ['Filho (a)', 'Esposo (a)'].includes(item?.text?.toString())
          })
        })
      )
      .subscribe((response: any): void => {
        const tipo = response.map((item: any) => ({ id: item.id, text: item.nome }))
        this.tipoFamiliares = tipo.filter((item: any) => item.id > 2); // excepto pai e mãe
      })
  }



  private criarForm() {
    //const regexTelefone = /^9\d{8}$/;
    const regexTelefone = /^\d{8,15}$/;
    const regexNome = '^[A-Za-zÀ-ÖØ-öø-ÿ- ]*$';
    this.simpleForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(4), Validators.pattern(regexNome)]],
      contacto: ['', Validators.pattern(regexTelefone)],
      sigpq_tipo_familiar_id: ['', Validators.required],
      sigpq_tipo_documento_id: ['', Validators.required],
      data_de_nascimento: ['', [
        Validators.required
      ]],
      pessoafisica_id: [this.getPessoaId, Validators.required],
      anexo: ['', Validators.required],
    })
  }

  validateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, ''); // Permite somente números
  }




  uploadFile(event: any, campo: any = null): void {
    let file: File | Blob = event.target.files[0]
    this.simpleForm.get(campo)?.setValue(file);
    this.simpleForm.get(campo)?.updateValueAndValidity();
  }

  public handlerCollapse($evt: any) {
    const collapse: any = document.querySelector(`#${$evt}`)
    const faInput: any = collapse.querySelector('.fa-1');

    if (faInput) {
      faInput.classList.toggle('fa-plus');
      faInput.classList.toggle('fa-minus');
    }
  }


  private get getData() {
    const formData = new FormData()
    formData.append('nome', String(this.simpleForm.value.nome).trim().toUpperCase())
    formData.append('contacto', this.simpleForm.value.contacto)
    formData.append('sigpq_tipo_familiar_id', this.simpleForm.value.sigpq_tipo_familiar_id)
    formData.append('sigpq_tipo_documento_id', this.simpleForm.value.sigpq_tipo_documento_id)
    formData.append('anexo', this.simpleForm.value.anexo)
    formData.append('data_de_nascimento', this.simpleForm.value.data_de_nascimento)
    formData.append('pessoafisica_id', this.simpleForm.value.pessoafisica_id)
    if(!this.buscarId)formData.append('activo','1')
    return formData
  }
 
  public onSubmit() {

    if (this.simpleForm.invalid || this.submitted)
      return
    const formData = this.getData
    this.isLoading = true
    this.submitted = true;

    const type = this.buscarId ? this.agregadoFamiliarService.editar(formData, this.buscarId) : this.agregadoFamiliarService.registar(formData)

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

  private get getDado_activo() {
    const formData = new FormData()
    formData.append('activo','1')
    return formData
  }


    setItemAprovar(item:any)
  {
    const dados = this.getDado_activo
      const type = this.agregadoFamiliarService.activo(dados, item.id)
  
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


  public reiniciarFormulario = () => {
    $('#file-familiar').val('')
    this.simpleForm.reset()
    this.simpleForm.patchValue({
      pessoafisica_id: this.getPessoaId
    })
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5
    this.filtro.search = ''
    this.buscarAgregadoFamiliares()
  }



  public filtrarPagina(key: any, $e: any, reiniciar: boolean = true) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }

    this.buscarAgregadoFamiliares()
  }

  private buscarAgregadoFamiliares() {
    this.agregadoFamiliarService.listar({ ...this.filtro, pessoafisica_id: this.getPessoaId }).pipe().subscribe({
      next: (response: any) => {



        // this.agregadosFamiliarFile = response.data.filter((documento: any) => {

        //   // Use includes para verificar se o valor está presente no array
        //   if (['Bilhete de Identidade', 'Boletim de Nascimento'].includes(documento?.sigpq_tipo_documento_nome)) {
        //     return true; // Retorna true para incluir o documento no resultado
        //   }
        //   return false
        // });



        this.agregadosFamiliares = response.data
        this.agregadosFamiliarFile = response.data

        // this.agregadosFamiliares = response.data.filter((documento: any) => {

        //   // Use includes para verificar se o valor está presente no array
        //   if (['Bilhete de Identidade', 'Boletim de Nascimento'].includes(documento?.sigpq_tipo_documento_nome)) {
        //     return true; // Retorna true para incluir o documento no resultado
        //   } else {
        //     return false; // Retorna false para excluir o documento do resultado
        //   }
        // });

        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      }
    });

    //hasConjuge=this.agregadosFamiliares.filter((item:any)=>{item.})
    //console.log("Dados recuperados:",this.agregadosFamiliares)

  }


  public get getPessoaId(): number {
    return this.params?.getInfo as number ?? this.params?.getId as number
  }

  construcao() {
    alert('Em construção')
  }

  visualizar(documento: any) {


    const opcoes = {
      pessoaId: this.getPessoaId,
      url: ''
    }

    this.fileUrl = null

    if (['Bilhete de Identidade', 'Boletim De Nascimento'].includes(documento?.sigpq_tipo_documento_nome)) {
      opcoes.url = documento?.anexo || null
    } else {
      const documentoAux = this.agregadosFamiliarFile.find((f: any) => f.sigpq_tipo_documento_id == documento.sigpq_tipo_documento_id)
      opcoes.url = documentoAux?.anexo || null
    }

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


  public setItem(item: any) {
    if (!item) return
    this.agregadosFamiliar = item

    if (item?.anexo) {
      $('#text').css('color', 'green').text('Contem arquivo*')
    } else {
      $('#text').css('color', 'red').text('Não contem arquivo*')
    }
  console.log("Dados recebidos:",item)
    this.simpleForm.patchValue({
      nome: item?.nome,
      contacto: item?.contacto,
      sigpq_tipo_familiar_id: item?.sigpq_tipo_familiar_id,
      sigpq_tipo_documento_id: item?.sigpq_tipo_documento_id,
      data_de_nascimento:item?.data_de_nascimento
      ? this.formatarData(item.data_de_nascimento)
      : null, // Converte para 'YYYY-MM-DD' ou null
      anexo: item?.anexo,
    })


  }

  private corrigirFormatoData(data: string): string | null {
    if (!data) return null;

    // Verificar o formato esperado "DD/MM/YYYY HH:mm:ss"
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})(?: (\d{2}):(\d{2}):(\d{2}))?$/;
    const match = data.match(regex);

    if (!match) {
      console.warn('Data inválida:', data);
      return null;
    }

    // Rearranjar para "YYYY-MM-DDTHH:mm:ssZ"
    const [, dia, mes, ano, hora = '00', minuto = '00', segundo = '00'] = match;
    return `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}Z`; // Z garante UTC
  }



  private formatarData(data: any): string | null {
    if (!data) return null;

    // Corrigir o formato, se necessário
    const dataCorrigida = this.corrigirFormatoData(data);
    if (!dataCorrigida) return null;

    const parsedDate = new Date(dataCorrigida);

    // Verificar se a data é válida
    if (isNaN(parsedDate.getTime())) {
      console.warn('Data inválida após correção:', dataCorrigida);
      return null;
    }

    // Retornar no formato "YYYY-MM-DD"
    return parsedDate.toISOString().split('T')[0];
  }


  public limparItem() {
    this.agregadosFamiliar = null
    $('#text').css('color', 'none').text('')
  }

  public get buscarId() {
    return this.agregadosFamiliar?.id
  }

}
