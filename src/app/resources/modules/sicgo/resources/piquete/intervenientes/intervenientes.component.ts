import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-modulo-intervenientes',
  templateUrl: './intervenientes.component.html',
  styleUrls: ['./intervenientes.component.css']
})
export class IntervenientesComponent implements OnInit {
  @ViewChild('navigationMenu') navigationMenu!: ElementRef;

  constructor(private renderer: Renderer2) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
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


  
  Nav = [
    
    
    { 
      label: 'Participantes',  
      selected: false, 
      url: '/piips/sicgo/piquete/interveniente/participantes',
      icon: 'fas fa-edit', 
      roles: ['admin'], // Somente Admin pode ver
    },
    { 
      label: 'Vitimas',  
      selected: false, 
      url: '/piips/sicgo/piquete/interveniente/vitimas',
      icon: 'fas fa-edit', 
      roles: ['admin'], // Somente Admin pode ver
    },
    { 
      label: 'Testemunhas',  
      selected: false, 
      url: '/piips/sicgo/piquete/interveniente/testemunhas',
      icon: 'bi bi-person-lock', 
      roles: ['admin'], 
      permissions: ['ocorrencia-update'], // Admin e Operador com essa permissão podem ver
    },
      { 
    label: 'Acusados',  
    selected: false, 
    url: '/piips/sicgo/piquete/interveniente/acusado',
    icon: 'bi bi-person-lock', 
    roles: ['admin'], 
    permissions: ['ocorrencia-update'], 
  },
  { 
    label: 'Lesados',  
    selected: false, 
    url: '/piips/sicgo/piquete/interveniente/lesados',
    icon: 'bi bi-person-lock', 
    roles: ['admin'], 
    permissions: ['ocorrencia-update'], 
  },
  { 
    label: 'Detidos',  
    selected: false, 
    url: '/piips/sicgo/piquete/interveniente/detidos',
    icon: 'bi bi-person-lock', 
    roles: ['admin'], 
    permissions: ['ocorrencia-update'], 
  },
  { 
    label: 'Condutores',  
    selected: false, 
    url: '/piips/sicgo/piquete/interveniente/condutor',
    icon: 'bi bi-person-lock', 
    roles: ['admin'], 
    permissions: ['ocorrencia-update'], 
  },
  { 
    label: 'Denúncia Anônima',  
    selected: false, 
    url: '/piips/sicgo/piquete/interveniente/denuncia-anonima',
    icon: 'bi bi-person-lock', 
    roles: ['admin'], 
    permissions: ['ocorrencia-update'], 
  },
  { 
    label: 'Denúncia Pública',  
    selected: false, 
    url: '/piips/sicgo/piquete/interveniente/denuncia-publica',
    icon: 'bi bi-person-lock', 
    roles: ['admin'], 
    permissions: ['ocorrencia-update'], 
  },
  { 
    label: 'Subinformante',  
    selected: false, 
    url: '/piips/sicgo/piquete/interveniente/subinformantes',
    icon: 'bi bi-person-lock', 
    roles: ['admin'], 
    permissions: ['ocorrencia-update'], 
  },
  { 
    label: 'Oficial Operativo',  
    selected: false, 
    url: '/piips/sicgo/piquete/interveniente/oficial-operativo',
    icon: 'bi bi-person-lock', 
    roles: ['admin'], 
    permissions: ['ocorrencia-update'], 
  },
     
    
    
    
  ];

  // Handle tab click (toggle selected state)
  onTabClick(clickedTab: any): void {
    this.Nav.forEach(tab => tab.selected = false);
    clickedTab.selected = true;
  }
}
 