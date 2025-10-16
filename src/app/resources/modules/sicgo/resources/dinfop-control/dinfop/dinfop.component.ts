import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '@core/authentication/auth.service';
import { OcorrenciaService } from '@resources/modules/sicgo/core/service/ocorrencia.service';

@Component({
  selector: 'app-dinfop',
  templateUrl: './dinfop.component.html',
  styleUrls: ['./dinfop.component.css']
})
export class DinfopComponent implements OnInit {
  @ViewChild('navigationMenu') navigationMenu!: ElementRef;

  constructor(public authService: AuthService, private router: Router, private renderer: Renderer2,private ocorrenciaService: OcorrenciaService) {}
  ngOnInit(): void {
   
  }

  ngAfterViewInit(): void {
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

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  isNavigating = false;
 
  navigate(event: MouseEvent, route: string) {
    if (this.isNavigating) {
      event.preventDefault(); // Impede navegação enquanto está em progresso
      return;
    }

    this.isNavigating = true;
    this.router.navigate([route]).finally(() => {
      this.isNavigating = false; // Redefine após navegação
    });
  }

  
  private get role() {
    
    return this.authService?.role?.name?.toString().toLowerCase()
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


get filteredTabs() {
    const { role, orgao, Nav } = this;
    // const orgao = this.orgao; // Obtendo o órgão do usuário
  
    // Se for admin, retorna todas as abas
    if (role === 'admin') {
      return this.Nav;
    }
      // Se for do órgão DINFOP, só vê a aba DINFOP
      if (orgao === 'DINFOP') {
        return this.Nav.filter(tab => tab.url.includes('/dinfop'));
      }

    // Filtra as abas com base no órgão do usuário
    return this.Nav.filter(tab => {
      if (tab.url.includes('/dinfop') && orgao !== 'DINFOP') {
        return false; // Oculta a rota DINFOP para usuários que não pertencem ao órgão DINFOP
      }
      return true; // Mantém visível as outras abas
    });

  

  // Se não for do DINFOP, oculta a aba DINFOP e mostra as outras
  return Nav.filter(tab => 
    orgao === 'DINFOP' ? tab.url.includes('/dinfop') : !tab.url.includes('/dinfop')
  );
  }
 
  Nav = [
   
    { 
      label: 'Ocorrencias',  
      selected: false, 
      url: '/piips/sicgo/dinfop/ocorrencias',
      icon: 'fas bi-person-lock', 
      roles: ['admin'], // Somente Admin pode ver
    },
    
    { 
      label: 'Expedientes',  
      selected: false, 
      url: '/piips/sicgo/dinfop/expedientes',
      icon: 'fas fa-edit', 
      roles: ['admin'], // Somente Admin pode ver
    },
    { 
      label: 'Delituosos',  
      selected: false, 
      url: '/piips/sicgo/dinfop/delituosos',
      icon: 'bi bi-person-lock', 
      roles: ['admin'], 
      permissions: ['expediente-update'], // Admin e Operador com essa permissão podem ver
    },
     
    { label: 'DETIDOS',selected: false, url: '/piips/sicgo/piquete',  icon: 'bi bi-person-lock' },
    { label: 'CONDENADOS',selected: false, url: '/piips/sicgo/piquete',  icon: 'bi bi-person-lock' },
    { label: 'Grupos',selected: false, url: '/piips/sicgo/dinfop/grupos',  icon: 'bi bi-people-fill' },
    { label: 'Associação',selected: false, url: '/piips/sicgo/dinfop/associacao',  icon: 'bi bi-people-fill' },
    { label: 'Tribunal',selected: false, url: '/piips/sicgo/dinfop/decisao',  icon: 'bi bi-bank2' },
    
    
    
  ];

  // Handle tab click (toggle selected state)
  onTabClick(clickedTab: any): void {
    this.Nav.forEach(tab => tab.selected = false);
    clickedTab.selected = true;
  }
  openOccurrence(): void {
    // Habilitar compartilhamento antes de abrir o modal
   
      // Desabilitar compartilhamento após o modal ser fechado
      this.ocorrenciaService.enableSharing(false);
      this.ocorrenciaService.disableSharing(true);

    
  }
}
