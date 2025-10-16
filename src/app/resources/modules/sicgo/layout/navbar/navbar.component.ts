import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { SecureService } from '@core/authentication/secure.service';

interface Tab {
  url: string;
  label: string;
  selected?: boolean;
}

@Component({
  selector: 'app-sigop-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  menuActive: string = 'dashboard';
  agora = Date.now();

  constructor(
    public authService: AuthService,
    private renderer: Renderer2,
    private secureService: SecureService
  ) { }
isCompact = false; // Define se a classe será aplicada
 

@Output() toggleSidebar = new EventEmitter<boolean>();

collapsed = true;


  @HostListener('window:scroll', [])
  onWindowScroll() {
    const h = document.body.scrollHeight;
    const y = window.scrollY;

    this.isCompact = y > (h * 0.03) && y < h;
  }

  
  private get role() {
    
    return this.authService?.role?.name?.toString().toLowerCase()
  }
  public get isAdmin() {
    return ['admin', 'root'].includes(this.role)
  }

  get orgao() {
    return this.authService.orgao.sigla
}

get permissions() {
    return this.authService?.permissions
}

get pessoa() {
    return this.authService?.pessoa
}

 
filteredTabs: Tab[] = [];
  
tabs: Tab[] = [
  { url: '/piips/sicgo/piquete', label: 'Ocorrencias', selected: true },
  { url: '/piips/sicgo/dinfop', label: 'Dinfop', selected: false },
  { url: '/piips/sicgo/diip', label: 'IIp', selected: false }
];

ngOnInit(): void {
  this.updateFilteredTabs();
}

ngAfterViewInit(): void {
  setTimeout(() => {
    this.collapsed = true;
  }, 0);
}


updateFilteredTabs(): void {
  this.filteredTabs = this.getFilteredTabs();
}

getFilteredTabs(): Tab[] {
  // Admin tem acesso a todas as abas
  if (this.role === 'admin') {
    return this.tabs;
  }

  // Usuários DINFOP só veem a aba DINFOP
  if (this.orgao === 'DINFOP') {
    return this.tabs.filter(tab => tab.url.includes('/dinfop'));
  }

  // Demais usuários veem todas as abas exceto DINFOP
  return this.tabs.filter(tab => !tab.url.includes('/dinfop'));
}

onTabClick(clickedTab: Tab): void {
  // Atualiza o estado 'selected' de todas as abas
  this.tabs.forEach(tab => {
    tab.selected = (tab.url === clickedTab.url);
  });
  
  // Atualiza a lista filtrada
  this.updateFilteredTabs();
}


 
  onRouterLinkActive(event: any) {
    this.menuActive = event;
  }

 
 
  get nomeUtilizador() {
    return this.authService.user.nome_completo
  }


  get aceder_painel_piips() {
    return this.authService.user.aceder_painel_piips
  }
 
@ViewChild('sidebar') sidebar!: ElementRef;
@ViewChild('content') content!: ElementRef;


toggle(): void {
  this.collapsed = !this.collapsed;
  this.toggleSidebar.emit(this.collapsed);

  const contentEl = document.querySelector('#content') as HTMLElement;
  const sidebarEl = document.querySelector('#sidebar') as HTMLElement;

  if (!sidebarEl || !contentEl) return;

  sidebarEl.classList.toggle('collapsed', this.collapsed);
  contentEl.classList.toggle('collapsed', this.collapsed);
  contentEl.classList.toggle('blurred', !this.collapsed);
}

 
 
 



menuAtivo = false;

  alternarMenu() {
    this.menuAtivo = !this.menuAtivo;
  }



  fgColor: string = '#000000'; // Default foreground color
  bgColor: string = '#ffffff'; // Default background color
  radius: number = 0; // Default radius
  
 

  // Handle Foreground color change
  onFgChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    document.documentElement.style.setProperty('--fg', target.value);
  }

  // Handle Background color change
  onBgChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    document.documentElement.style.setProperty('--bg', target.value);
  }

  // Remove background image
  onImageClick(): void {
    document.documentElement.style.setProperty('--img', 'none');
  }

  // Apply Gradient as background image
  onGradientClick(): void {
    document.documentElement.style.setProperty('--img', 'var(--grad)');
  }

 

  // Handle range (radius) change
  onRadiusChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    document.documentElement.style.setProperty('--radius', `${target.value}px`);
  }
}