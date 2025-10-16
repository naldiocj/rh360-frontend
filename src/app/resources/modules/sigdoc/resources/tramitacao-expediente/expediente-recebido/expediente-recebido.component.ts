import { Component, OnInit, ViewChild } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { EntradaExpedienteService } from '@resources/modules/sigdoc/core/service/entrada-expediente.service';
import { DetalheOuHistoricoComponent } from '../detalhe-ou-historico/detalhe-ou-historico.component';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';
const QRCode = require('qrcode');

@Component({
  selector: 'app-expediente-recebido',
  templateUrl: './expediente-recebido.component.html',
  styleUrls: ['./expediente-recebido.component.css']
})
export class ExpedienteRecebidoComponent implements OnInit {

   @ViewChild(DetalheOuHistoricoComponent) detalheComponent!: DetalheOuHistoricoComponent;

  arquivoIdParaExcluir: any;
  visualizarFoto: boolean = true;
  TramitarDocumento: any;
  public documento: any;
  public isLoading: boolean = false;
  public fileUrl: any;
  public carregarDocumento: boolean = false;
  public pagination: Pagination = new Pagination();
  public totalBase: number = 0;
  public correspondencias: any = [];
  public correspondenciaId: number | null = null
  public siglaSelecionada: string | undefined;

  public estados = [
    {
      cor: '#FFA500',
      texto: 'Normal'
    },  
    {
      cor: '#006400',
      texto: 'Confidencial',
    },
    {
      cor: '#FF0000',
      texto: 'Secreto',
    },
    {
      cor: 'rgb(0, 0, 0)',
      texto: 'Muito Secreto',
    },
    {
      cor: 'rgb(64, 232, 22)',
      texto: 'Empresárial'
    }
    ]

  corStatus(status: string): string {
    switch (status) {
      case 'Normal':
        return '#FFA500'; //Laranja - Urgente
      case 'Secreto': 
        return '#FF0000'; //Vermelho - Secreto
      case 'Muito Secreto': 
        return 'rgb(0, 0, 0)'; //Vermelho - Secreto
      case 'Confidencial':
        return '#006400';
      case 'Empresário':
        return 'rgb(64, 232, 22)'; //Verde escuro - Confidecial
      default:
        return 'transparent';
    }
  }

  public filtro: any = {
    search: '',
    page: 1,
    perPage: 5,

  }

  public orgaoId: any; 

  constructor(private correspondenciaService: EntradaExpedienteService, private ficheiroService: FicheiroService, private secureService: SecureService) {
    this.orgaoId = this.getNomeOrgao;
  }

  ngOnInit(): void {
    this.buscarCorrespondencias()
  }

  setArquivoIdParaExcluir(id: number): void {
    this.arquivoIdParaExcluir = id;
  }

  /*private buscarCorrespondencias(): void {
    const options = {
      ...this.filtro,
      remetente_id: this.getOrgaoId
    }
    this.correspondenciaService.listarTodos(options).pipe().subscribe({
      next: (response: any) => {
        this.correspondencias = response.data
       
        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);
      }
    });
  }*/

    buscarCorrespondencias() {
      const options = {
        ...this.filtro,
        remetente_id: this.getOrgaoId
      }
      this.isLoading = true;
      this.correspondenciaService.listarTodos(options).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe((response) => {
        this.correspondencias = response.data;
  
        this.totalBase = response.meta.current_page ?
          response.meta.current_page === 1 ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;
  
        this.pagination = this.pagination.deserialize(response.meta);
      });
    }

  public carregarDetalheDocumento(id: number): void {
    this.detalheComponent.carregarDetalhe(id);
}
 
  public recarregarPagina(): void {
    this.documento = {};
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = ''
    this.pagination.current_page = 1
    this.buscarCorrespondencias()
  }

  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarCorrespondencias()
  }

  public registar() {
    this.documento = null
  }

  public atualizartabela() {
    this.registar()
    this.buscarCorrespondencias()
  }

  editar(item: any) {
    console.log(item)
    this.documento = { ...item}
  }

  public construcao() {
    alert('Em contrucao')
  }

  public get getOrgaoId() {
    return this.secureService.getTokenValueDecode()?.orgao?.id
  }

  public get getOrgaoSigla() {
    return this.secureService.getTokenValueDecode()?.orgao?.sigla
  }

  public get getNomeOrgao(): any {
    return this.secureService.getTokenValueDecode()?.orgao?.nome_completo;
  }

  setId(id: number | null) {
    this.correspondenciaId = id
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

    this.carregarDocumento = true
    this.ficheiroService.getFileStore(opcoes).pipe(
      finalize(() => {
        this.carregarDocumento = false
      })
    ).subscribe((file) => {
      this.fileUrl = this.ficheiroService.createImageBlob(file);
    });

    return true
  }

  setTramitarDocumentos(item: any) {
    console.log(item)
    this.TramitarDocumento = item
  }
}