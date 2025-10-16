import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, AfterViewInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { SecureService } from '@core/authentication/secure.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { FingerprintService } from '@resources/modules/sicgo/core/service/fingerprint/FingerprintService.service';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import { DinfopDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitouso.service';
import { ImageSearchService } from '@resources/modules/sicgo/core/service/piquete/dinfop/delitousos/ImageSearchService/image-search-service.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'delituoso-view',
  templateUrl: './delituoso-view.component.html',
  styleUrls: ['./delituoso-view.component.css'],
    animations: [
      trigger('expandCollapse', [
        state('expanded', style({
          width: '900px',
          opacity: 1,
          transform: 'translateX(0)', // Move para o centro
          padding: '10px',
        })),
        state('collapsed', style({
          width: '0px',
          opacity: 0,
          transform: 'translateX(100%)', // Começa da direita
          padding: '0px',
        })),
        transition('expanded <=> collapsed', animate('400ms ease')),
      ])
    ]
  })
export class DelituosoViewComponent implements AfterViewInit {
  //Trabalho de partilha de informções  entre components
  @Input() toggleBanner = new EventEmitter<boolean>();
  @Input() delituosoId: any[] = [];
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
  idade: number | null = null;
  fotodfault = './assets/assets_sicgo/img/kv.png';
recordSize: { sizeInKB: number; sizeInMB: number } | null = null;
  @ViewChild('navigationMenu') navigationMenu!: ElementRef;

  currentImage: string = '';
  progress: number = 0;
  isSearching: boolean = true;
  searchCompleted: boolean = false;
  registeredFingers: any = {
    rightThumb: {
      template: null,
      image: '',
      fingerId: 11,
      description: 'Polegar Direito',
    },
    rightIndex: {
      template: null,
      image: '',
      fingerId: 12,
      description: 'Indicador Direito',
    },
    rightMiddle: {
      template: null,
      image: '',
      fingerId: 13,
      description: 'Médio Direito',
    },
    rightRing: {
      template: null,
      image: '',
      fingerId: 14,
      description: 'Anelar Direito',
    },
    rightLittle: {
      template: null,
      image: '',
      fingerId: 15,
      description: 'Mindinho Direito',
    },
    leftThumb: {
      template: null,
      image: '',
      fingerId: 21,
      description: 'Polegar Esquerdo',
    },
    leftIndex: {
      template: null,
      image: '',
      fingerId: 22,
      description: 'Indicador Esquerdo',
    },
    leftMiddle: {
      template: null,
      image: '',
      fingerId: 23,
      description: 'Médio Esquerdo',
    },
    leftRing: {
      template: null,
      image: '',
      fingerId: 24,
      description: 'Anelar Esquerdo',
    },
    leftLittle: {
      template: null,
      image: '',
      fingerId: 25,
      description: 'Mindinho Esquerdo',
    },
  };


  constructor(
    private imageSearchService: ImageSearchService,
    private renderer: Renderer2,
    private dinfopDelitousoService: DinfopDelitousoService,
    private secureService: SecureService, 
    private ficheiroService: FicheiroService,
    private fingerprintService:FingerprintService,
  ) { }
 

  ngOnInit(): void {
    this.buscarDelituoso()
   
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
    if (changes['showBannerup'] && this.showBannerup && this.showBannerup !== 0) {
      const id = Number(this.showBannerup);

    if (!id || isNaN(id) || id <= 0) {
      console.warn('ID inválido no teste de massa:', this.showBannerup);
      return;
    }
      this.buscarDelituoso();
      this.getSavedFingerprints(this.showBannerup);
    }
    
  
  
    const asidebar = document.querySelector('#asidebars') as HTMLElement;
    if (asidebar) {
      if (this.showBannerup !== 0) {
        asidebar.classList.add('visible');
      } else {
        asidebar.classList.remove('visible');
      }
    }
  }
  

close() {
this.showBannerup = 0;
const asidebar = document.querySelector('#asidebars') as HTMLElement;

if (asidebar) { 
  if (this.showBannerup !== 0) {
    asidebar.classList.remove('visible');
  } else {
    asidebar.classList.remove('visible'); 
  }
}
}
  calculateRecordSize(record: any): { sizeInKB: number; sizeInMB: number } {
    const jsonString = JSON.stringify(record);
    const sizeInBytes = new Blob([jsonString]).size;
    const sizeInKB = sizeInBytes / 1024;
    const sizeInMB = sizeInKB / 1024;
    return { sizeInKB, sizeInMB };
  }

  getSavedFingerprints(delituosoId: number) {
    this.fingerprintService
      .getSavedFingerprints(delituosoId)
      .subscribe((res) => {
        console.log(res);
        const { fingerprints } = res;
        for (let [finger, fingerData] of Object.entries(fingerprints)) {
          if (fingerprints[finger].template) {
            this.registeredFingers[finger].template =
              fingerprints[finger].template;
            this.registeredFingers[finger].image = fingerprints[finger].image;
          }
        }
      });
  }

  getRegisteredFingerKeys(): string[] {
    return Object.keys(this.registeredFingers);
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
    this.imageSearchService.searchImagesForDelituoso(delituoso).subscribe({
      complete: () => {
        this.progress = 100;  // A busca foi finalizada
        setTimeout(() => {
          this.isSearching = false;
          this.searchCompleted = true;
        }, 1500); // Pequeno delay para a animação do progress bar
      }
    });
  }

  visualizarDelituososs(delituoso: any) {
    if (!delituoso || !delituoso.fotografias) {
      console.error('Delituoso ou fotografias não definidos');
      return;
    }
  
    const { image_frontal, image_lateral_direita, image_lateral_esquerda, image_nuca } = delituoso.fotografias;
  
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
   // Exibe a foto da nuca
   if (image_nuca) {
    this.ficheiroService.getFileUsingUrl(image_nuca)
      .pipe(finalize(() => {}))
      .subscribe(
        (file) => {
          delituoso.fileUrlNuca = this.ficheiroService.createImageBlob(file);
        },
        (error) => console.error('Erro ao carregar a imagem lateral esquerda:', error)
      );
  }
}
  
imageSrc: number = 0;

  showImage(view: number) {
   this.imageSrc = view;
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


  isExpanded = false;

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }
  
  

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
 
 
   
}

 

 
 
