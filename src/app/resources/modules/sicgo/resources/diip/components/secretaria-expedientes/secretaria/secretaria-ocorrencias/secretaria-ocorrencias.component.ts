import { NgIfContext } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import { ExpedienteDiipService } from '@resources/modules/sicgo/core/service/piquete/iip/diip/expediente-diip.service';
import { Ocorrencia } from '@resources/modules/sicgo/shared/model/ocorrencias.model';
import { Pagination } from '@shared/models/pagination';

@Component({
  selector: 'app-secretaria-ocorrencias',
  templateUrl: './secretaria-ocorrencias.component.html',
  styleUrls: ['./secretaria-ocorrencias.component.css']
})
export class SecretariaOcorrenciasComponent implements OnInit {
expedientes: any[] = []

  public estados = [
    {
      cor: '#cc0000',
      texto: 'Pendente',
    },
    {
      cor: '#ffcc00',
      texto: 'Em andamento',
    },
    {
      cor: '#00cc00',
      texto: 'Concluido',
    },
    {
      cor: 'rgb(0, 143, 251)',
      texto: 'Enviado',
    },
  ];
  public filtro = {
    search: '',
    perPage: 10,
    page: 1,
    tipoOcorrencia: null,
    nivelSeguranca: null,
    controloPrendido: null,
    importancia: null,
    gravidade: null,
    zona_localidade: null,
    enquadramento_legal: null,
    provincias: null,
    municipios: null,
    dataAte: null,
    dataDe: null,
  };
  public options: any = {
    placeholder: 'Seleciona uma opção',
    width: '100%',
  };

  showBanner: string | null = null; // Inicialmente, o banner está visível
  public isOffcanvasVisible: string | null = null;
  public isOffVisible: string | null = null;
  public pagination = new Pagination();
  public totalBase: number = 0;
  ocorrencia: any;
  ocorrenciaVitima: any;
  public ocorrencias: any[] = [];

  content: TemplateRef<NgIfContext<boolean>> | any;
  
  constructor(
    private ocorrenciaService: OcorrenciaService,
      private formatarDataHelper: FormatarDataHelper,
    private secureService: SecureService,
    private expedienteService: ExpedienteDiipService
  ) { }

  ngOnInit(): void {

 
    this.buscarOcorrencias();
    
    this.carregarExpedientes()
  }

 
  carregarExpedientes() {
    this.expedienteService.listarExpedientes().subscribe(data => {
      this.expedientes = data.map(expediente => ({
        ...expediente,
        testemunhas: expediente.testemunhas && Array.isArray(expediente.testemunhas)
          ? expediente.testemunhas
          : [] // Garante que sempre será um array
      }));
  
      console.log('Expedientes processados:', this.expedientes);
    });
  }
  
  
  

  despachar(id: number, dados: any) {
    this.expedienteService.despacharExpediente(id, dados).subscribe(() => this.carregarExpedientes())
  }

  remeterMinisterio(id: number) {
    const nup = prompt('Informe o NUP atribuído pelo Ministério Público:')
    if (nup) {
      this.expedienteService.remeterMinisterio(id, nup).subscribe(() => this.carregarExpedientes())
    }
  }

  receberOpcs(id: number) {
    this.expedienteService.receberOpcs(id).subscribe(() => this.carregarExpedientes())
  }

  distribuirChefia(id: number) {
    this.expedienteService.distribuirChefia(id).subscribe(() => this.carregarExpedientes())
  }

  distribuirDepartamento(id: number) {
    this.expedienteService.distribuirDepartamento(id).subscribe(() => this.carregarExpedientes())
  }

  iniciarInstrucao(id: number) {
    this.expedienteService.iniciarInstrucao(id).subscribe(() => this.carregarExpedientes())
  }

  concluir(id: number) {
    this.expedienteService.concluirExpediente(id).subscribe(() => this.carregarExpedientes())
  }

    buscarOcorrencias() {
    const options = { ...this.filtro };
    this.ocorrenciaService
      .listar(options)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.ocorrencias = response.data.map((item: { expediente: any; }) => ({ ...item, expediente: item.expediente || null }));


          this.pagination = this.pagination.deserialize(response.meta);
        },
      });
  }

  novaOcorrencia() {
    this.ocorrencia = new Ocorrencia();
  }

  setOcorencia(item: Ocorrencia) {
    this.ocorrencia = item;
  }

  setOcorenciaVitima(item: Ocorrencia) {
    this.ocorrenciaVitima = item;
  }
  //tema
  public optionsExportar: any = {
    extracto: false,
    pessoal: false,
    profissional: false,
    provimento: false,
    funcao: false,
  };

  //tema


  public filtrarPagina($e: any, key: any, reiniciar: boolean = true) {

    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    } else if (key == 'tipoOcorrencia') {
      this.filtro.tipoOcorrencia = $e;
    } else if (key == 'nivelSeguranca') {
      this.filtro.nivelSeguranca = $e;
    } else if (key == 'controloPrendido') {
      this.filtro.controloPrendido = $e;
    } else if (key == 'importancia') {
      this.filtro.importancia = $e;
    } else if (key == 'gravidade') {
      this.filtro.gravidade = $e;
    } else if (key == 'zona_localidade') {
      this.filtro.zona_localidade = $e;
    } else if (key == 'enquadramento_legal') {
      this.filtro.enquadramento_legal = $e;
    } else if (key == 'dataAte') {
      this.filtro.dataAte = $e;
    } else if (key == 'dataDe') {
      this.filtro.dataDe = $e;
    }
    if (reiniciar) {
      this.filtro.page = 1
    }

    this.buscarOcorrencias();
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.filtro.tipoOcorrencia = null;
    this.filtro.nivelSeguranca = null;
    this.filtro.controloPrendido = null;
    this.filtro.importancia = null;
    this.filtro.gravidade = null;
    this.filtro.zona_localidade = null;
    this.filtro.enquadramento_legal = null;

    this.buscarOcorrencias();
  }

  
  
  resultado: any
  transformar(occurrence: any) {
    this.expedienteService.transformarOcorrencia(occurrence).subscribe(
      res => {
        this.resultado = res
        alert('Ocorrência transformada em expediente com sucesso!')
         // Atualiza a ocorrência para incluir o ID do expediente criado
         occurrence.expediente = res.expediente.id;
      },
      err => {
        console.error('Erro na transformação', err)
        alert('Erro ao transformar a ocorrência.')
      }
    )
  }

  public toggle(id: any): void {
    // Adiciona a propriedade 'isVisible' ao objeto 'file', se ela não existir


    const main: HTMLElement | any = document.querySelector('#main_');
    const asidebar: HTMLElement | any = document.querySelector('#asidebar');

    if (main && asidebar) {
      let asideLeft: string | any = asidebar.style.right;
      let mainLeft: string | any = main.style.marginRight;
      if (this.isOffcanvasVisible == id) {
        this.isOffcanvasVisible = null;
        this.isOffcanvasVisible == id;

        if (asideLeft == '' || asideLeft == '0px') {
          asideLeft = '-300px';
          mainLeft = '0px';
        }
        // Alterna a visibilidade
      } else if (this.isOffcanvasVisible != id) {
        this.isOffcanvasVisible = id; // Abre o novo sidebar e fecha o anterior

        asideLeft = '0px';
        mainLeft = '600px';
      }
      asidebar.style.right = asideLeft;
      main.style.marginRight = mainLeft;
    }
  }

  buscarId(): number {
    return this.ocorrencia as number;
  }
 

  abrirfechar(p: any): void {
    // Adiciona a propriedade 'isVisible' ao objeto 'file', se ela não existir
    if (p.showBannerup !== p.showBannerup) {
      p.showBannerup = true;
    } else {
      p.showBannerup = !p.showBannerup; // Alterna a visibilidade
    }

  }

  //INTERVENIENT
  public KV(id: any): void {
    // Adiciona a propriedade 'isVisible' ao objeto 'file', se ela não existir~~
    console.log('antes : ', id);

    // if (this.isOffcanvasVisible === id) {
    this.isOffcanvasVisible = id;

    // Alterna a visibilidade
    // }

  }


  public setmodal(id: any): void {

    // if (this.isOffcanvasVisible === id) {
    this.isOffVisible = id;

    // Alterna a visibilidade
    // }

  }



}

