import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';
import { finalize } from 'rxjs';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
 
@Component({
  selector: 'piquete-view',
  templateUrl: './piquete-view.component.html',
  styleUrls: ['./piquete-view.component.css'],
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
export class PiqueteViewComponent implements OnChanges, OnInit {
  //Trabalho de partilha de informções  entre components
  @Output() toggleBanner = new EventEmitter<boolean>();
  @Input() view: any[] = [];

  // Inicialmente, o banner está visível
  @Input() showBannerup: number | any = 0; // Inicialmente, o banner está visível
  //Fim Trabalho de partilha de informções  entre components

  public ocorrencias: any[] = [];
  params: any;
  isLoading: boolean | undefined;
  fileUrl: any;



  constructor(
    private secureService: SecureService,
    private ocorrenciaService: OcorrenciaService,
    private ficheiroService: FicheiroService,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {
    
  }

  get orgao_id() {
    return this.secureService.getTokenValueDecode().orgao.id
  }
 
 
  ngAfterViewInit(): void {
 
  } 
  openSidebar() {
    this.showBannerup = true;
  }

  closeSidebar() {
    this.showBannerup = false;
  }
  verFoto(urlAgente: any, efectivo: boolean = false): boolean | void {

    if (!urlAgente) return false
    const opcoes = {
      pessoaId: this.showBannerup ?? this.params.getInfo,
      url: urlAgente
    }

    this.isLoading = true;

    this.ficheiroService.getFile(opcoes).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((file) => {
      this.fileUrl = this.ficheiroService.createImageBlob(file);

    });
  }



    // modal
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['view']) {
        this.ocorrencias = this.view;
    
        // Se quiser exibir a imagem quando receber dados:
        const primeira = this.view?.[0];
        if (primeira && primeira.arquivos) {
          this.verFoto(primeira.arquivos, false);
        }
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
  

isExpanded = false;

toggleExpand() {
  this.isExpanded = !this.isExpanded;
}

selectedTab: any = null;
currentComponents: any[] = [];
 
selectTab(tab: any): void {
  this.selectedTab = tab;

  if (tab.multipleComponents) {
    this.currentComponents = tab.components;
  } else {
    this.currentComponents = [{ component: tab.component }];
  }
}



Nav = [
  // {
  //   label: 'SARGENTO DIA',
  //   icon: 'fas fa-users',
  //   selected: false,
  //   multipleComponents: true,
  //   componentName: 'app-listar-veiculo' ,
    
  // },
  {
    label: 'Mapa',
    icon: 'fas fa-map',
    selected: false,
    componentName: 'piquete-map'
  }
];


selectedComponentName: string | null = null;

onTabClick(tab: any): void {
  if (this.selectedComponentName === tab.componentName) {
    this.selectedComponentName = null; // Oculta o componente se já estiver visível
  } else {
    this.selectedComponentName = tab.componentName; // Exibe o componente
  }
}

  
}
