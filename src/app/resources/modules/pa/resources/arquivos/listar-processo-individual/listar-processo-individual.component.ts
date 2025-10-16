import { Component, OnInit } from '@angular/core';
import { AgenteService } from '../../../core/service/agente.service';
import { Pagination } from '../../../../../../shared/models/pagination';
import { ProcessoIndividualService } from '../../../../sigpq/core/service/Processo-Individual.service';
import { finalize } from 'rxjs';
import { FicheiroService } from '../../../../../../core/services/Ficheiro.service';
import { Select2OptionData } from 'ng-select2';
import { FormatarDataHelper } from '../../../../../../core/helper/formatarData.helper';
import { TipoDocumentoService } from '../../../../sigpq/core/service/config/Tipo-documento.service';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-listar-processo-individual',
  templateUrl: './listar-processo-individual.component.html',
  styleUrls: ['./listar-processo-individual.component.css']
})
export class ListarProcessoIndividualComponent implements OnInit {

  totalBase: number = 0;
  public pagination = new Pagination();
  arquivos: any = [];
  public fileUrl: any

  public documentosFile: any = []
  public carregarDocumento: boolean = false
  public documentos: any = []
  public simpleForm: any
  public documento: any = null
  public submitted: boolean = false
  public isLoading: boolean = false

  options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  public id: any
    tipoDocumentos: any = [
      { id: '', text: 'Selecione uma opção' },
      { id: 'Pessoal', text: 'Pessoal' },
      { id: 'Profissional', text: 'Profissional' },
    ]
  
    tipoOutrosDados: Array<Select2OptionData> = []
  
    public formatAccept = ['.pdf']
    
  public filtro = {
    page: 1,
    perPage: 5,
    search: '',
  };

  ngOnInit(): void {
    this.criarForm()
    this.buscarTipoOutrosDados()
    this.buscarProcessoIndividual()
  }

  filtrarPagina(key: string, $e: any) {
    if (key === 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarProcessoIndividual();
  }
 
  

  constructor(private fb: FormBuilder,private agenteService: AgenteService,
     private tipoDocumentoService: TipoDocumentoService,
        private processoService: ProcessoIndividualService,
        public formatarDataHelper: FormatarDataHelper,
    private ficheiroService: FicheiroService) { }

    private buscarTipoOutrosDados(): void {
        const opcoes = {}
        this.tipoDocumentoService.listarTodos(opcoes)
          .pipe(
            finalize((): void => {
    
            })
          )
          .subscribe((response: any): void => {
            this.tipoOutrosDados = response.map((item: any) => ({ id: item.id, text: item.nome }))
          })
      }
    
      public uploadFile(event: any, campo: any = null): void {
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
        formData.append('nid', this.simpleForm.value.nid)
        formData.append('sigpq_tipo_documento_id', this.simpleForm.value.sigpq_tipo_documento_id)
        formData.append('pessoafisica_id', this.simpleForm.value.pessoafisica_id)
        formData.append('anexo', this.simpleForm.value.anexo)
        if(!this.buscarId)formData.append('activo','0')
        return formData
      }
    
      public onSubmit() {
    
        if (this.simpleForm.invalid || this.submitted && !this.getPessoaId) {
          return
        }
    
    
        this.isLoading = true
        this.submitted = true
        const formData = this.getData
        const type = this.buscarId ? this.processoService.editar(formData, this.buscarId,) : this.processoService.registar(formData)
    
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
    
      
  
      public reiniciarFormulario = () => {
        this.simpleForm.reset()
        $("#file-2").val('')
        this.simpleForm.patchValue({
          pessoafisica_id: this.getPessoaId
        })
      }
    
      public recarregarPagina() {
        this.filtro.page = 1;
        this.filtro.perPage = 5
        this.filtro.search = ''
    
        this.buscarProcessoIndividual()
      }
    
    
    
     
    
      private buscarProcessoIndividual() {
    
        if (!this.getPessoaId) return
    
        this.processoService.listar({ ...this.filtro, pessoafisica_id: this.getPessoaId }).pipe(
          finalize(() => {
            this.carregarDocumento = false
          })
        )
          .subscribe((response) => {
    
            this.documentosFile = response.data.filter((documento: any) => {
              // Use includes para verificar se o valor está presente no array
              if (['Pessoal', 'Profissional'].includes(documento.nid)) {
                return true; // Retorna true para incluir o documento no resultado
              }
              return false
            });
    
            this.documentos = response.data.filter((documento: any) => {
              // Use includes para verificar se o valor está presente no array
              if (['Pessoal', 'Profissional'].includes(documento.nid)) {
                return true; // Retorna true para incluir o documento no resultado
              } else {
                return false; // Retorna false para excluir o documento do resultado
              }
            });
    
    
            this.totalBase = response.meta.current_page ?
              response.meta.current_page === 1 ? 1
                : (response.meta.current_page - 1) * response.meta.per_page + 1
              : this.totalBase;
    
            this.pagination = this.pagination.deserialize(response.meta);
    
          })
    
      }
    
      visualizar(documento: any) {
    
        const opcoes = {
          pessoaId: this.getPessoaId,
          url: ''
        }
    
        this.fileUrl = null
    
        if (['Pessoal', 'Profissional'].includes(documento.nid)) {
          opcoes.url = documento.anexo || null
        } else {
          const documentoAux = this.documentosFile.find((f: any) => f.sigpq_tipo_documento_id == documento.sigpq_tipo_documento_id)
          opcoes.url = documentoAux.anexo
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
    
      construcao() {
        alert('Em construção')
      }
    
      public get getId() {
        return this?.id
      }
      public get getPessoaId() {
        return this.agenteService.id as number;
      }
    
      private criarForm() {
        this.simpleForm = this.fb.group({
          nid: ['', Validators.required],
          sigpq_tipo_documento_id: ['', Validators.required],
          anexo: ['', Validators.required],
          pessoafisica_id: [this.getPessoaId, Validators.required]
        })
      }
    
    
      public setItem(item: any) {
        if (!item) return
    
        this.documento = item;
    
        if (item?.anexo) {
          $('#text-').css('color', 'green').text('Contem arquivo*')
        } else {
          $('#text-').css('color', 'red').text('Não contem arquivo*')
        }
    
        this.simpleForm.patchValue({
          nid: item?.nid,
          anexo: item?.anexo,
          sigpq_tipo_documento_id: item?.sigpq_tipo_documento_id,
          pessoafisica_id: this.getPessoaId
        })
    
    
      }
    
      public get buscarId() {
        return this.documento?.id
      }
      public limparItem() {
        this.documento = null
        $('#text-').css('color', 'none').text('')
      }
    

  

}
