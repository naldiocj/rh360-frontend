import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SecureService } from '@core/authentication/secure.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sicgo-delituoso-preview',
  templateUrl: './delituoso-preview.component.html',
  styleUrls: ['./delituoso-preview.component.css']
})
export class DelituosoPreviewComponent implements AfterViewInit {
  //Trabalho de partilha de informções  entre components
  @Input() toggleBanner = new EventEmitter<boolean>();
  @Input() isview: number | any;
  activeTab: string = 'delituoso'; // Aba inicial

  // Inicialmente, o banner está visível
  @Input() showBannerup: number | any; // Inicialmente, o banner está visível
  //Fim Trabalho de partilha de informções  entre components

  delituoso: any[] = [];
  digitais: any[] = []; // Dados das digitais
  biometria: string | null = null; // Dados das digit 
  imgThumb:  string | null = null;
  fileUrlFrontal: string | null = null;
  fileUrlLateralDireita: string | null = null;
  fileUrlLateralEsquerda: string | null = null;
  isLoading: boolean | undefined;
  fileUrl: any;
  delituosoId: any;
  idade: number | null = null;
  fotodfault = './assets/assets_sicgo/img/kv.jpg';
recordSize: { sizeInKB: number; sizeInMB: number } | null = null;
  @ViewChild('navigationMenu') navigationMenu!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private dinfopDelitousoService: DinfopDelitousoService,
    private secureService: SecureService, 
    private ficheiroService: FicheiroService
  ) { }
 

  ngOnInit(): void {
    this.buscarDelituoso()
    // Observa mudanças no ID
    this.dinfopDelitousoService.currentId$.subscribe((id) => {
      this.showBannerup = id;
       
    });
  }
  
  ngAfterViewInit(): void {
    // Verifique se o elemento está disponível
    if (this.navigationMenu && this.navigationMenu.nativeElement) {
      const links = this.navigationMenu.nativeElement.querySelectorAll('a');

      // Adicionando evento de clique a todos os links
      links.forEach((link: HTMLElement) => {
        this.renderer.listen(link, 'click', (event: Event) => {
          event.preventDefault(); // Previne a navegação padrão

          // Remove a classe 'active' de todos os itens
          links.forEach((lnk: HTMLElement) =>
            this.renderer.removeClass(lnk.parentElement, 'active')
          );

          // Adiciona a classe 'active' ao item clicado
          this.renderer.addClass(link.parentElement, 'active');
        });
      });
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showBannerup'] && this.showBannerup) {
      this.buscarDelituoso();
 
    }
  }

  calculateRecordSize(record: any): { sizeInKB: number; sizeInMB: number } {
    const jsonString = JSON.stringify(record);
    const sizeInBytes = new Blob([jsonString]).size;
    const sizeInKB = sizeInBytes / 1024;
    const sizeInMB = sizeInKB / 1024;
    return { sizeInKB, sizeInMB };
  }

  buscarDelituoso() {
    const id = Number(this.showBannerup); // Converte para número
    if (isNaN(id)) {

      return; // Ou trate de forma adequada
    }

    this.dinfopDelitousoService
      .ver(id) // Passa o ID convertido
      .pipe(finalize(() => { /* Aqui você pode esconder um loader se necessário */ }))
      .subscribe({
        next: (response: any) => {
          // Certifique-se de que a resposta seja um array
          this.delituoso = Array.isArray(response) ? response : [response];
        
           this.recordSize = this.calculateRecordSize(this.delituoso);
          // Exibe as fotos de todos os delituosos automaticamente
          this.delituoso.forEach((delituoso: any) => {
            this.visualizarDelituoso(delituoso);
          });

          // Exibe todos os dados biometricos do delituosos automaticamente
          this.delituoso.forEach((delituoso: any) => {
            this.visualizarBiometricoDelituoso(delituoso);
          });
        },

        error: (err) => {
          console.error('Erro ao buscar delituoso:', err);
          // Você pode mostrar uma mensagem de erro ao usuário aqui
        }
      });
  }
 
  get orgao_id() {
    return this.secureService.getTokenValueDecode().orgao?.id;
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
  

  // Exibe as os dados biometricos delituosos
  visualizarBiometricoDelituoso(delituoso: any) {
 
    // Exibe a foto frontal
    if (delituoso.digitais[0].impressaoCaminho) {
      this.ficheiroService.getFileUsingUrl(delituoso.digitais[0].impressaoCaminho)
        .pipe(finalize(() => { }))
        .subscribe((file) => {
          delituoso.digitais[0].imgThumb = this.ficheiroService.createImageBlob(file);
    
        });
    }

 
  }


  public toggle(): void {
    // Adiciona a propriedade 'isVisible' ao objeto 'file', se ela não existir


    const main: HTMLElement | any = document.querySelector('#main_');
    const asidebar: HTMLElement | any = document.querySelector('#asidebar');

    if (main && asidebar) {
      let asideLeft: string | any = asidebar.style.right;
      let mainLeft: string | any = main.style.marginRight;
      if (this.showBannerup == this.showBannerup) {
        this.showBannerup = null;
        this.showBannerup == this.showBannerup;

        if (asideLeft == '' || asideLeft == '0px') {
          asideLeft = '-300px';
          mainLeft = '0px';
        }
        // Alterna a visibilidade
      } else if (this.showBannerup != this.showBannerup) {
        this.showBannerup = this.showBannerup; // Abre o novo sidebar e fecha o anterior

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
       
    }
  }




  // Função para alternar entre as abas
  openTab(tab: string): void {
    this.activeTab = tab;
  }



  

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
 
 
}


