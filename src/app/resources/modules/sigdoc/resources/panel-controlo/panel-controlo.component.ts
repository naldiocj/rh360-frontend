import { Component, OnInit } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { DashboardService } from '../../core/service/dashboard.serive';
import { Auth } from '@shared/models/auth.model';
import { AuthService } from '@core/authentication/auth.service';

@Component({
  selector: 'app-panel-controlo',
  templateUrl: './panel-controlo.component.html',
  styleUrls: ['./panel-controlo.component.css'],
})
export class PanelControloComponent implements OnInit {

  public setup: Auth
  public orgaoId: any;
  public orgaoSigla: any;  
  public contagemRegistros: number | undefined;
  public contagemDocumetosTramitado: number | undefined;
  public contagemDocumetosRecebido: number | undefined;
  public contagemDocumetosRecebidoPendente: number | undefined;//contagemDocumetosRecebidoPendente
  public contagemArquivosDitais: number | undefined;
  public contagemCriarDocumentos: number | undefined;

  public totalDocumentos!: number; 
  public porcentagem!: number;
  
  public porcentagemDocumetosEntrada!: number;
  public porcentagemDocumetosTramitado!: number;
  public porcentagemDocumetosRecebido!: number;
  public porcentagemDocumetosRecebidoPendente!: number;
  public porcentagemArquivosDitais!: number;
  public porcentagemCriarDocumentos!: number;

  public filtro: any = {
    search: '',
    page: 1,
    perPage: 5,
  }

  constructor(private dashboardService: DashboardService, private secureService: SecureService, private authService: AuthService) {
    this.setup = this.secureService.getTokenValueDecode();
    this.orgaoId = this.getNomeOrgao;
    this.orgaoSigla = this.getOrgaoSigla;
  }

  ngOnInit(): void {
    this.getentradaDocumentos();
    this.getdocumentoTramitado();
    this.getdocumentoRecebido();
    this.getarquivosdigitais();
    this.getcriardocumnetos();
    this.getdocumentoRecebidoPendentes()
  }

  public get getOrgaoSigla() {
    return this.secureService.getTokenValueDecode()?.orgao?.sigla
  }

  public get getNomeOrgao(): any {
    return this.secureService.getTokenValueDecode()?.orgao?.nome_completo;
  }

  public estados = [{
    cor: '#FFA500',
    texto: 'Pendente'
  }, {
    cor: '#826AF9',
    texto: 'Expedido',
  }, {
    cor: 'rgb(64, 232, 22)',
    texto: 'Despacho'
  },
  {
    cor: '#E31212',
    texto: 'Saida'
  },
  {
    cor: '#000000',
    texto: 'Parecer'
  },
  {
    cor: '#FFFF00',
    texto: 'Pronuciamento'
  },
  ]

  private getentradaDocumentos(): void {    
    const options = {
    ...this.filtro,
    remetente_id: this.getOrgaoId
  }
    this.dashboardService.entradaDocumentos(options).subscribe({
      next: (response: number) => {
        console.log('Total de registro consoante o Orgão', response);
        this.contagemRegistros = response;
        this.calcularTotalDocumentos();
      },
      error: (error) => {
        console.error('Erro ao obter a contagem de registros', error);
      }
    });
  }

  private getdocumentoTramitado(): void {    
    const options = {
    ...this.filtro,
    remetente_id: this.getOrgaoId
  }
    this.dashboardService.documentoTramitadoRecebido(options).subscribe({
      next: (response: number) => {
        console.log('Total de registro consoante o Orgão', response);
        this.contagemDocumetosTramitado = response;
        this.calcularTotalDocumentos();
      },
      error: (error) => {
        console.error('Erro ao obter a contagem de registros', error);
      }
    });
  }

    private getdocumentoRecebido(): void {    
      const options = {
        ...this.filtro,
        enviado_para: this.getOrgaoId,
  }
    this.dashboardService.documentoTramitadoRecebido(options).subscribe({
      next: (response: number) => {
        console.log('Total de registro consoante o Orgão', response);
        this.contagemDocumetosRecebido = response;
        this.calcularTotalDocumentos();
      },
      error: (error) => {
        console.error('Erro ao obter a contagem de registros', error);
      }
    });
  }

  private getdocumentoRecebidoPendentes(): void {    
    const options = {
      ...this.filtro,
      enviado_para: this.getOrgaoId,
      num: 4,
}
  this.dashboardService.documentoTramitadoRecebidoPendente(options).subscribe({
    next: (response: number) => {
      console.log('Total de registro consoante o Orgão', response);
      this.contagemDocumetosRecebidoPendente = response;
      this.calcularTotalDocumentos();
    },
    error: (error) => {
      console.error('Erro ao obter a contagem de registros', error);
    }
  });
}

  private getarquivosdigitais(): void {    
    const options = {
      ...this.filtro,
      remetente_id: this.getOrgaoId,
}
  this.dashboardService.arquivosdigitais(options).subscribe({
    next: (response: number) => {
      console.log('Total de registro consoante o Orgão', response);
      this.contagemArquivosDitais = response;
      this.calcularTotalDocumentos();
    },
    error: (error) => {
      console.error('Erro ao obter a contagem de registros', error);
    }
  });
}

private getcriardocumnetos(): void {    
  const options = {
    ...this.filtro,
    remetente_id: this.getOrgaoId,
}
this.dashboardService.criardocumnetos(options).subscribe({
  next: (response: number) => {
    console.log('Total de registro consoante o Orgão', response);
    this.contagemCriarDocumentos = response;
    this.calcularTotalDocumentos();
  },
  error: (error) => {
    console.error('Erro ao obter a contagem de registros', error);
  }
});
}

public get getModulo() {
  return this.authService?.user?.aceder_todos_agentes ?
    'DPQ - DIRECÇÃO DE PESSOAL E QUADROS ' :
    `${this.setup.orgao?.sigla} - ${this.setup.orgao?.nome_completo}`;
}

private calcularTotalDocumentos(): void {
  // Verifica se todas as contagens foram carregadas
  if (this.contagemRegistros !== undefined &&
      this.contagemDocumetosTramitado !== undefined &&
      this.contagemDocumetosRecebido !== undefined &&
      this.contagemArquivosDitais !== undefined &&
      this.contagemCriarDocumentos !== undefined) {
    
    const totalDocumentos = this.contagemRegistros +
                            this.contagemDocumetosTramitado +
                            this.contagemDocumetosRecebido +
                            this.contagemArquivosDitais +
                            this.contagemCriarDocumentos;
                            
    this.totalDocumentos = totalDocumentos;

    // Calcular as porcentagens//
    this.porcentagemDocumetosEntrada = (this.contagemRegistros / 100 );
    this.porcentagemDocumetosTramitado = (this.contagemDocumetosTramitado / 100);
    this.porcentagemDocumetosRecebido = (this.contagemDocumetosRecebido / 100);
    this.porcentagemArquivosDitais = (this.contagemArquivosDitais / 100);
    this.porcentagemCriarDocumentos = (this.contagemCriarDocumentos / 100);

    // Formatar as porcentagens
    this.porcentagemDocumetosEntrada = parseFloat(this.porcentagemDocumetosEntrada.toFixed(2));
    this.porcentagemDocumetosTramitado = parseFloat(this.porcentagemDocumetosTramitado.toFixed(2));
    this.porcentagemDocumetosRecebido = parseFloat(this.porcentagemDocumetosRecebido.toFixed(2));
    this.porcentagemArquivosDitais = parseFloat(this.porcentagemArquivosDitais.toFixed(2));
    this.porcentagemCriarDocumentos = parseFloat(this.porcentagemCriarDocumentos.toFixed(2));

    this.porcentagem = (totalDocumentos / 100);
    this.porcentagem = parseFloat(this.porcentagem.toFixed(2));
  }
}
  
  public get getOrgaoId() {
    return this.secureService.getTokenValueDecode()?.orgao?.id
  }
  
}
