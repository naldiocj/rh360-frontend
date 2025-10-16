import { Component, OnInit, ViewChild } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { EntradaExpedienteService } from '@resources/modules/sigdoc/core/service/entrada-expediente.service';
import { Pagination } from '@shared/models/pagination';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { finalize } from 'rxjs';
import { DetalheOuHistoricoComponent } from '../detalhe-ou-historico/detalhe-ou-historico.component';
const QRCode = require('qrcode');

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  @ViewChild(DetalheOuHistoricoComponent) detalheComponent!: DetalheOuHistoricoComponent;

  arquivoIdParaExcluir: any;
  visualizarFoto: boolean = true;
  TramitarDocumento: any
  public documento: any
  public isLoading: boolean = false
  public fileUrl: any
  public carregarDocumento: boolean = false;
  public pagination: Pagination = new Pagination();
  public totalBase: number = 0;
  public correspondencias: any = [];
  public correspondenciaId: number | null = null
  public siglaSelecionada: string | undefined;
  public nomeOrgaoSelecionada: string | undefined;

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

  constructor(private entradaExpedienteService: EntradaExpedienteService, private ficheiroService: FicheiroService, private secureService: SecureService) {
    this.orgaoId = this.getNomeOrgao;
  }

  ngOnInit(): void {
    this.ListarEntradaExpediente()
  }

  setArquivoIdParaExcluir(id: number): void {
    this.arquivoIdParaExcluir = id;
  }

  ListarEntradaExpediente() {
    const options = {
      ...this.filtro,
      remetente_id: this.getOrgaoId
    }
    this.isLoading = true;
    this.entradaExpedienteService.listarTodos(options).pipe(
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

  confirmarEliminar(): void {
    if (this.arquivoIdParaExcluir) {
      this.entradaExpedienteService.eliminar(this.arquivoIdParaExcluir).subscribe(
        () => {
          this.arquivoIdParaExcluir = null; 
          this.recarregarPagina(); 
  
          const modal = document.getElementById('confirmModal');
          if (modal) {
            modal.classList.remove('show'); 
            modal.style.display = 'none'; 
            window.location.reload();
            document.body.classList.remove('modal-open'); 
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }
          }
        },
        (error) => {
          console.error('Erro ao excluir registro:', error);
        }
      );
    }
  }
  
  public recarregarPagina(): void {
    this.documento = {};
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = ''
    this.pagination.current_page = 1
    this.ListarEntradaExpediente()

  }

  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.ListarEntradaExpediente()
  }

  public registar() {
    this.documento = null
    this.documento = {};
  }

  public atualizartabela() {
    this.registar()
    this.ListarEntradaExpediente()
  }

  editar(item: any) {
    console.log(item)
    this.documento = { ...item}
  }

  public construcao() {
    alert('Em contrucao')
  }

  public validarEliminar(item: any) {

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

  get nomeUtilizador() {
    return this.secureService.getTokenValueDecode().user?.nome_completo;
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
      console.log('Valor de file:', file);
      this.fileUrl = this.ficheiroService.createImageBlob(file);
    });

    return true
  }

  abrirPDF(correspondencias: any) {
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();
    const diaAtual = dataAtual.getDate();
    const forData = {
      data: dataAtual.toLocaleDateString(),
      ano: anoAtual,
      dia: diaAtual
    };

    let pdf = new jsPDF('l', 'pt', 'a8');
    let ab = '../../../../../../../assets/dashboard/Vector 51.png';
    pdf.setFontSize(8);

    var x = 20;
    var y = 20;
    autoTable(pdf, {
      didDrawCell: (data) => {
        if (data.section === 'body' && data.column.index === 0) {
          pdf.addImage(ab, 'jpg', data.cell.x + 2, data.cell.y + 2, 10, 10);
        }
      },
    });
    pdf.addImage(ab, 'jpg', x - 14, y - 16, 60, 60);
    pdf.setFont('helvetica', 'bold');
    //pdf.text(`CODIGO: ${formData.referenciaDoc}`, x - 14, y + 70);

    let provenienciaText;
    if (correspondencias.tipo_proveniencia_id == 1) {
      provenienciaText = correspondencias.orgao_id;
    } else if (correspondencias.tipo_proveniencia_id == 2) {
      provenienciaText = 'Externo';
    } else {
      provenienciaText = 'Desconhecido';
    }
    //pdf.text(`REFERÊNCIA: ${correspondencias.referenciaDoc}`, x - 14, y + 80);
    pdf.text(`CÓDIGO: ${correspondencias.id}`, x - 14, y + 90);
    pdf.text(`REF. Nº: ${correspondencias.referenciaDoc}/${provenienciaText}/PNA`, x - 14, y + 100);

    pdf.setFontSize(6);
    pdf.text(`*Pela Ordem e Pela Paz ao Serviço da Nação*`, x + 20, y + 110);

    pdf.setFontSize(15);
    const nomeOrgao = this.getNomeOrgao;
    const nomeRegistto = this.nomeUtilizador;

    const options = {
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      margin: 1
    };
    let proOutroText;
    if (correspondencias.tipo_proveniencia_id == 1) {
      proOutroText = correspondencias.proveniencia;
    } else if (correspondencias.tipo_proveniencia_id == 2) {
      proOutroText = correspondencias.provenienciaDoc;
    } else {
      proOutroText = 'Desconhecido';
    }

    let OficioText;
    if (correspondencias.numeroOficio.trim() != '' || correspondencias.numeroOficio != null) {
      OficioText = correspondencias.numeroOficio;
    }  else {
      OficioText = 'sem Nº de oficio';
    }
    const qrCodeValue = `Código: ${correspondencias.id}\nProveniência: ${proOutroText}\nDestino: ${nomeOrgao}\nRef. Nº: ${correspondencias.referenciaDoc}/${provenienciaText}/PNA\nNº do Documento: ${OficioText}\nRegistado Por: ${nomeRegistto}\nData de Registo: ${correspondencias.data}\nProcessado automático por SIGDOC/PNA/${forData.ano}`;
    
    QRCode.toDataURL(qrCodeValue, options)
      .then((url: any) => {
        pdf.addImage(url, 'PNG', x + 90, y + -11, 80, 80);
        console.log(pdf.output('blob'));
        pdf.output('dataurlnewwindow');
      })
      .catch((err: any) => {
        console.error('Erro ao gerar QR code:', err);
      });
  }
}