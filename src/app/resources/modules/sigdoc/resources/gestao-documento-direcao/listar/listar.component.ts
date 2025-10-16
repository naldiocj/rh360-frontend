import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { DOCUMENT } from '@angular/common';
import { CriarDocumentoService } from '@resources/modules/sigdoc/core/service/criar-documento.service';
import { Select2OptionData } from 'ng-select2';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

interface Documento {
  id: string;
  nome?: string;
  file_path: string;
  remetente_id: string;
}

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  documentos: Documento[] = [];
  public correspondencias: any = [];
  //public documento: Array<Select2OptionData> = [];
  public pagination: Pagination = new Pagination();
  public totalBase: number = 0;
  public isLoading: boolean = false
  public carregarDoc: boolean = false;
  public fileUrl: any
  public documento: any

  public filtro = {
    page: 1,
    perPage: 5,
    search: '',
    tipo_estrutura_sigla: '',
    pessoafisica: null,
    pessoajuridica_id: null,
  };


  constructor(
    private criardocumentoService: CriarDocumentoService,
    private ficheiroService: FicheiroService,
    private secureService: SecureService) {}

  ngOnInit(): void {
    this.carregarDocumentos();
  }

  public recarregarPagina(): void {
    //this.documento = {};
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = ''
    this.pagination.current_page = 1
    this.carregarDocumentos()

  }

  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.carregarDocumentos()
  }

  carregarDocumentos() {
      const options = {
        ...this.filtro,
        remetente_id: this.getOrgaoId
      }
      this.isLoading = true;
      this.criardocumentoService.listarTodos(options).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe((response) => {
        console.log('store response', response);
        this.documentos = response.data;
  
        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;
  
        this.pagination = this.pagination.deserialize(response.meta);
      });
    }


  carregarDocumentoss(): void {
    const options = {
      ...this.filtro,
      remetente_id: this.getOrgaoId
    }
    this.criardocumentoService.listarTodos(options).subscribe({
      next: (response: Documento[]) => {
        this.documentos = response;
      },
      error: (err) => {
        console.error('Erro ao carregar documentos:', err);
      }
    });
  }

    public visualizar(documento: any) {
      const opcoes = {
        pessoaId: documento?.remetente_id,
        url: ''
      }
      this.fileUrl = null
      opcoes.url = documento.anexo || null
      this.documento = documento
  
      if (!opcoes.url) return false
  
      this.carregarDoc = true
      this.ficheiroService.getFileStore(opcoes).pipe(
        finalize(() => {
          this.carregarDoc = false
        })
      ).subscribe((file) => {
        console.log('Valor de file:', file);
        this.fileUrl = this.ficheiroService.createImageBlob(file);
      });
  
      return true
    }

    public get getOrgaoId(){
      return this.secureService.getTokenValueDecode()?.orgao?.id;
    }
}