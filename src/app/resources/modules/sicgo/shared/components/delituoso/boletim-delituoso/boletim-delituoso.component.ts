import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';
import { finalize } from 'rxjs';

interface OptionsExportar {
  ocorrencia: boolean;
  interveninte: boolean;
  veiculo: boolean,
  profissional: boolean;
  provimento: boolean;
  funcao: boolean;
  cargo: boolean;
  tipobens: boolean;
}

@Component({
  selector: 'app-sicgo-dinfop-boletim-delituoso',
  templateUrl: './boletim-delituoso.component.html',
  styleUrls: ['./boletim-delituoso.component.css']
})
export class BoletimDelituosoComponent implements OnChanges, OnInit {

  @Input() ocorrenciaId: any | number;
  @Input() public options: any;
  public isLoading: boolean = false;
  public isLoadingCivil: boolean = false;
  public isLoadingEfectivo: boolean = false;
  public fileUrl: any;
  public fileUrlCivil: any;
  public funcaos: any;
  public cargos: any;
  public mobilidades: any;
  public provimentos: any;
  public indexes: any = [];
  public funcionario: any;
  @Output() eventRegistarOuEditar = new EventEmitter<any>();

  public optionsExportar: OptionsExportar = {
    ocorrencia: false,
    interveninte: false,
    veiculo: false,
    profissional: false,
    provimento: false,
    funcao: false,
    cargo: false,
    tipobens: false,
  };

  public ordens: any = {
    ocorrencia: 1,
    interveninte: 1,
    veiculo: 2,
    provimento: 1,
    funcao: 1
  };

  tipobens: any;
  public ocorrencias: any;
  testemunhas: any;
  veiculos: any;

  constructor(
    private renderer: Renderer2,
    private dinfopDelitousoService: DinfopDelitousoService,
    private secureService: SecureService, 
    private ficheiroService: FicheiroService, 
    private formatarData: FormatarDataHelper,
    public formatarDataHelper: FormatarDataHelper  
  ) { }

  get orgao_nome() {
    return this.secureService.getTokenValueDecode().orgao.nome_completo;
  }

  ngOnInit(): void {
    this.fetchData();
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
  }

  fetchOcorrencias(): void {
    // Verificar se `ocorrenciaId` está válido
    const pessoaId = this.getPessoaId;
    if (!pessoaId) {
       
      return; // Não faz a requisição se o ID não for válido
    }

    this.isLoading = true;
    this.dinfopDelitousoService.buscarFicha(pessoaId).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((response: any) => {
      this.ocorrencias = response;
      console.log(this.ocorrencias);
    });
  }

  fetchTipoBens(): void {
    const pessoaId = this.getPessoaId;
    if (!pessoaId) return;

    this.dinfopDelitousoService
      .ver(pessoaId)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.tipobens = response.tipobens;
        },
      });
  }

  fetchIntervenientes(): void {
    const pessoaId = this.getPessoaId;
    if (!pessoaId) return;

    this.dinfopDelitousoService
      .ver(pessoaId)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.testemunhas = response.testemunhas;
        },
      });
  }

  fetchVeiculos(): void {
    const pessoaId = this.getPessoaId;
    if (!pessoaId) return;

    this.dinfopDelitousoService
      .ver(pessoaId)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.veiculos = response.veiculos;
        },
      });
  }

  verFoto(urlAgente: any): boolean | void {
    if (!urlAgente) return false;

    const opcoes = {
      pessoaId: this.getPessoaId,
      url: urlAgente
    };

    this.isLoadingEfectivo = true;

    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
        this.isLoadingEfectivo = false;
      })
    ).subscribe((file: any) => {
      this.fileUrl = this.ficheiroService.createImageBlob(file);
    });
  }

  verFotoCivil(urlAgente: any): boolean | void {
    if (!urlAgente) return false;

    const opcoes = {
      pessoaId: this.getPessoaId,
      url: urlAgente
    };

    this.isLoadingCivil = true;

    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
        this.isLoadingCivil = false;
      })
    ).subscribe((file: any) => {
      this.fileUrlCivil = this.ficheiroService.createImageBlob(file);
    });
  }

  // Getter para obter o ID da pessoa
  public get getPessoaId(): number {
    // Verificar se o `ocorrenciaId` foi corretamente passado e atribuído
    
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
