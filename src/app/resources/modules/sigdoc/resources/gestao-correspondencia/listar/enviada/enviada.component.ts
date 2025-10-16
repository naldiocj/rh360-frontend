import { Component, OnInit } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { CorrespondenciaService } from '@resources/modules/sigdoc/core/service/Corrrespondencia.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
const QRCode = require('qrcode');

@Component({
  selector: 'app-enviada',
  templateUrl: './enviada.component.html',
  styleUrls: ['./enviada.component.css']
})
export class EnviadaComponent implements OnInit {

  public documento: any;
  public isLoading: boolean = false;
  public fileUrl: any;
  public carregarDocumento: boolean = false;
  public pagination: Pagination = new Pagination();
  public totalBase: number = 0;
  public correspondencias: any = [];
  public correspondenciaId: number | null = null;

  public estados = [
    {
      cor: '#FFA500',
      texto: 'Pendente'
    },  
    {
      cor: '#8B4513',
      texto: 'Recebido',
    },
    {
      cor: '#4682B4',
      texto: 'Em Tratamento',
    },
    /*{
      cor: '#826AF9',
      texto: 'Expedido',
    },*/ 
    {
      cor: 'rgb(64, 232, 22)',
      texto: 'Despacho'
    },
    /*{
      cor: '#E31212',
      texto: 'Saida'
    },*/
    {
      cor: '#000000',
      texto: 'Parecer'
    },
    {
      cor: '#FFFF00',
      texto: 'Pronuciamento'
    },
    ]

  corStatus(status: string): string {
    switch (status) {
      case 'Em tramitação':
        return '#87CEEB'; //azul
      case 'Expedido': 
        return '#008000'; //verde
      case 'Despachado':
        return '#FFFF00'; //amarelo
      case 'Arquivado':
        return '#808080'; //cinza
      case 'Encerrado':
        return '#FF0000'; //vermelho
      case 'Gerado pela aplicação':
        return '#4400FF'; //vermelho
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

  constructor(private correspondenciaService: CorrespondenciaService, private ficheiroService: FicheiroService, private secureService: SecureService) {
    this.orgaoId = this.getNomeOrgao;
  }

  ngOnInit(): void {
    this.buscarCorrespondencias()
  }

  /*private buscarCorrespondencias(): void {
    const options = {
      ...this.filtro,
      remetente_id: this.getOrgaoId
    };
  
    this.correspondenciaService.listarTodos(options).pipe().subscribe({
      next: (response: any) => {
        console.log(response);
  
        this.correspondencias = response.data;
  
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
  
  public recarregarPagina(): void {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = ''
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

  editar(documento: any) {
    console.log(documento)
    this.documento = documento
  }

  registar() {
    this.documento = null
  }

  public actualizarTabela() {
    this.registar()
    this.buscarCorrespondencias()
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
      pessoaId: documento?.anexo,
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
}
