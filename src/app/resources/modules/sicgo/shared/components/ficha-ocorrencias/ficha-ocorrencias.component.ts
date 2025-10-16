import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import { finalize } from 'rxjs/operators';

interface OptionsExportar {
  ocorrencia: boolean;
  interveninte: boolean;
  veiculo: boolean,
  profissional: boolean;
  grupos: boolean;
  vitimas: boolean;
  delituosos: boolean;
  cargo: boolean;
  tipobens: boolean;
}

@Component({
  selector: 'app-ficha-ocorrencias',
  templateUrl: './ficha-ocorrencias.component.html',
  styleUrls: ['./ficha-ocorrencias.component.css']
})
export class FichaOcorrenciasComponent implements OnChanges, OnInit {

  @Input() ocorrenciaId: any | number;
  @Input() public options: any;
  public isLoading: boolean = false;
  public isLoadingCivil: boolean = false;
  public isLoadingEfectivo: boolean = false;
  public fileUrl: any;
  public fileUrlCivil: any;
  public delituosos: any[] =[];
  public cargos: any;
  public mobilidades: any;
  public grupos: any[] =[];
  public indexes: any = [];
  public funcionario: any;
  fileUrlFrontal: string | null = null;
  fileUrlLateralDireita: string | null = null;
  fileUrlLateralEsquerda: string | null = null;
  
  @Output() eventRegistarOuEditar = new EventEmitter<any>();

  public optionsExportar: OptionsExportar = {
    ocorrencia: false,
    interveninte: false,
    veiculo: false,
    profissional: false,
    grupos: false,
    delituosos: false,
    vitimas: false,
    cargo: false,
    tipobens: false,
  };

  public ordens: any = {
    ocorrencia: 1,
    interveninte: 1,
    veiculo: 2,
    delituosos: 2,
    grupos: 3
  };

  tipobens: any[] = [];
  public ocorrencias: any;
  testemunhas: any[] = [];
  veiculos: any[] = [];

  constructor(
    private OcorrenciaService: OcorrenciaService,
    private secureService: SecureService,
    private ficheiroService: FicheiroService,
    private formatarData: FormatarDataHelper,
    public formatarDataHelper: FormatarDataHelper  ) { }


  get orgao_nome() {
    return this.secureService.getTokenValueDecode().orgao.nome_completo;
  }

  ngOnInit(): void {
    this.fetchData();
 
   }

  get nomeUtilizador(){
    return this.secureService.getTokenValueDecode().user.nome_completo
  }
 
  get orgao() {
    return this.secureService.getTokenValueDecode().orgao.sigla
}

get permissions() {
    return this.secureService.getTokenValueDecode()?.permissions
}

get pessoa() {
    return this.secureService.getTokenValueDecode()?.pessoa
}

get role() {
    return this.secureService.getTokenValueDecode()?.role
}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ocorrenciaId'] && changes['ocorrenciaId'].previousValue !== changes['ocorrenciaId'].currentValue) {
      this.fetchData();
    }
  }

  private fetchData(): void {
    this.fetchOcorrencias();
    this.fetchTipoBens();
    this.fetchIntervenientes();
    this.fetchVeiculos();
    this.fetchDelituosos();
    this.fetchGrupos();
  }

  fetchOcorrencias(): void {
    this.isLoading = true;
    this.OcorrenciaService.buscarFicha(this.getPessoaId).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((response: any) => {
      this.ocorrencias = response; 
    });
  }

  fetchTipoBens(): void {
    this.OcorrenciaService
      .ver(this.getPessoaId)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.tipobens = response;
        },
      });
  }
  fetchIntervenientes(): void {
    this.OcorrenciaService
      .ver(this.getPessoaId)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.testemunhas = response;
        },
      });
  }
  fetchVeiculos(): void {
    this.OcorrenciaService
      .ver(this.getPessoaId)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.veiculos = response;
        },
      });
  }

  fetchDelituosos(): void {
    this.OcorrenciaService
      .ver(this.getPessoaId)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.delituosos = response;
          // Exibe as fotos de todos os delituosos automaticamente
          this.delituosos.forEach((delituoso: any) => {
            this.visualizarDelituoso(delituoso);
          });
        },
      });
  }

    // Exibe as fotos e detalhes de todos os delituosos
    visualizarDelituoso(delituoso: any) {
      if (!delituoso || !delituoso.fotografias) {
        console.error('Delituoso ou fotografias não definidos');
        return;
      }
    
      const { image_frontal, image_lateral_direita, image_lateral_esquerda } = delituoso.fotografias;
    
      // Exibe a foto frontal
      if (image_frontal) {
        this.ficheiroService.getFileUsingUrl(image_frontal)
          .pipe(finalize(() => {}))
          .subscribe(
            (file) => {
              delituoso.fileUrlFrontal = this.ficheiroService.createImageBlob(file);
            },
            (error) => console.error('Erro ao carregar a imagem frontal:', error)
          );
      }
    
      // Exibe a foto lateral direita
      if (image_lateral_direita) {
        this.ficheiroService.getFileUsingUrl(image_lateral_direita)
          .pipe(finalize(() => {}))
          .subscribe(
            (file) => {
              delituoso.fileUrlLateralDireita = this.ficheiroService.createImageBlob(file);
            },
            (error) => console.error('Erro ao carregar a imagem lateral direita:', error)
          );
      }
    
      // Exibe a foto lateral esquerda
      if (image_lateral_esquerda) {
        this.ficheiroService.getFileUsingUrl(image_lateral_esquerda)
          .pipe(finalize(() => {}))
          .subscribe(
            (file) => {
              delituoso.fileUrlLateralEsquerda = this.ficheiroService.createImageBlob(file);
            },
            (error) => console.error('Erro ao carregar a imagem lateral esquerda:', error)
          );
      }
    }

  fetchGrupos(): void {
    this.OcorrenciaService
      .ver(this.getPessoaId)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.grupos = response;
        },
      });
  }




 
  public get getPessoaId(): number {
    return this.ocorrenciaId;
  }

  public getDataExtensao(data: any): string {
    return this.formatarData?.dataExtensao(data);
  }

  public eData(data: any): boolean {
    return data != null && data != '0000-00-00';
  }

  public imprimir = (cv: any): void => {
    const paraImprimir: any = document.querySelector(`#${cv}`);
    if (paraImprimir) {
      setTimeout(() => {
        document.body.innerHTML = paraImprimir.outerHTML;
        window.print();
        window.location.reload();
      }, 500);
    }
  }

  public onCheck(event: any): void {
    const id = event.target.getAttribute('id');
    if (id) {
      this.optionsExportar[id as keyof OptionsExportar] = event.target.checked;

      if (id.toLowerCase() === 'extracto') {
        const checks: Array<HTMLInputElement> = Array.from(document.querySelectorAll('input[type="checkbox"]'));
        checks.forEach(input => {
          const inputId = input.getAttribute('id');
          if (inputId && id !== inputId) {
            input.checked = event.target.checked;
            this.optionsExportar[inputId as keyof OptionsExportar] = event.target.checked;
          }
        });
      } else {
        const check: HTMLInputElement = document.querySelector('input[id="ocorrencia"]') as HTMLInputElement;
        if (check) {
          check.checked = true;
          this.optionsExportar['ocorrencia'] = true;
        }
      }
    }
  }

  public getGenero(genero: any): string | null {
    const gender = genero.toString().toLowerCase();
    return gender === 'm' ? 'Masculino' : gender === 'f' ? 'Feminino' : null;
  }

  public formatDate(data: any): string {
    return this.formatarDataHelper.formatDate(data, 'dd-MM-yyyy');
  }
  public formatDateano(data: any): string {
    return this.formatarDataHelper.formatDate(data, 'yyyy');
  }
}
