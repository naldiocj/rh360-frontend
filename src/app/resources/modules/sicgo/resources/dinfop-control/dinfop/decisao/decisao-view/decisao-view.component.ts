import { Component, EventEmitter, Input, OnInit, SimpleChanges } from '@angular/core';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { DelitousoTribulanResultadoProcessoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso_tribulan_resultado_processo.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'sicgo-decisao-view',
  templateUrl: './decisao-view.component.html',
  styleUrls: ['./decisao-view.component.css']
})
export class DecisaoViewComponent implements OnInit {
  @Input() toggleBanner = new EventEmitter<boolean>();
  @Input() isview:  number | any;

 // Inicialmente, o banner está visível
 @Input() showBannerup: number | any; // Inicialmente, o banner está visível
 public decisao: any[] = [];
 public delituosos: any[] = []; // Nome corrigido para 'delituosos'
 public isOffcanvasVisible: number | any;
 public isOffVisible: string | null = null;
 fileUrlFrontal: string | null = null;
 fileUrlLateralDireita: string | null = null;
 fileUrlLateralEsquerda: string | null = null;
 isLoading: boolean | undefined;
 fileUrl: any;
 idade: number | null = null;
 fotodfault = './assets/assets_sicgo/img/kv.jpg';


  constructor( private delitoTribunal:DelitousoTribulanResultadoProcessoService ,  private ficheiroService: FicheiroService) { }

  ngOnInit(): void {
    this.buscarDecisao();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showBannerup'] && this.showBannerup) {
      this.buscarDecisao();
    }
  }

  buscarDecisao() {
    const id = Number(this.showBannerup); // Converte para número o ID do banner
    if (isNaN(id)) {
      console.warn('ID inválido:', this.showBannerup); // Log de aviso
      return; // Sai se o ID for inválido
    }

    this.delitoTribunal
      .ver(id) // Passa o ID convertido para a API
      .pipe(finalize(() => { /* Pode ocultar um loader aqui se necessário */ }))
      .subscribe({
        next: (response: any) => {
          this.decisao = Array.isArray(response) ? response : [response];


          console.log('Decisão tratada:', this.decisao);

          // Itera sobre as decisões para encontrar delituosos
          this.decisao.forEach((decisao: any) => {
            // Verifica se a decisão contém o campo 'delituoso'
            if (decisao.delituoso) {
              this.delituosos = decisao.delituoso; // Atribui o grupo de delituosos
 
                this.visualizarDelituoso(this.delituosos); // Exibe ou trata cada delituoso

            } else {
              console.warn('Nenhum delituoso encontrado nesta decisão:', decisao);
            }
          });
        },
        error: (err: any) => {
          console.error('Erro ao buscar decisão/delituoso:', err); // Trata o erro da API
        }
      });
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
        mainLeft = '400px';
      }
      asidebar.style.right = asideLeft;
      main.style.marginRight = mainLeft;
    }
  }
  calculateAge(birthData: string | number | Date) {
    if (birthData) {
      const birthDate = new Date(birthData);
      const today = new Date();
      let idade = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        idade--;
      }

      this.idade = idade;
    } else {
      alert('Por favor, insira uma data de nascimento válida.');
    }
  }

  // Exibe as fotos e detalhes de todos os delituosos
  visualizarDelituoso(delituoso: any) {
    // Exibe a foto frontal
    if (delituoso.fotografias.image_frontal) {
      this.ficheiroService
        .getFileUsingUrl(delituoso.fotografias.image_frontal)
        .pipe(finalize(() => {}))
        .subscribe((file) => {
          delituoso.fileUrlFrontal = this.ficheiroService.createImageBlob(file);
        });
    }
  }
}
