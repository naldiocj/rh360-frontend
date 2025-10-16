import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-piquete',
  templateUrl: './piquete.component.html',
  styleUrls: ['./piquete.component.css'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('0.5s', style({ opacity: 1 }))
      ]),
      state('in', style({ opacity: 1 })),
      transition(':enter', [ style({ opacity: 0 }), animate(300) ]),
      transition(':leave', [ animate(300, style({ opacity: 0 })) ])
    ])
  ]
})
export class PiqueteComponent implements OnInit {
  @ViewChild('navigationMenu') navigationMenu!: ElementRef;

  constructor(private renderer: Renderer2,private el: ElementRef) {}
  ngOnInit(): void {
        this.updateActiveItem(); 
  }

  guiaVisto = localStorage.getItem('guiaVisto') === 'true';

 

  ngAfterViewInit(): void {
     // Adiciona o evento de scroll após a visualização estar pronta
     window.addEventListener('scroll', this.handleScroll);


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
 
  activeItem: HTMLElement | null = null;

  

  @HostListener('window:resize')
  onResize(): void {
    setTimeout(() => this.updateActiveItem(), 500);
  }

  toggleNavbar(): void {
    const navbarCollapse = this.el.nativeElement.querySelector('.navbar-collapse');
    if (navbarCollapse) {
      navbarCollapse.classList.toggle('show');
      setTimeout(() => this.updateActiveItem(), 300);
    }
  }

  onNavClick(event: Event): void {
    const target = event.target as HTMLElement;
    const navItems = this.el.nativeElement.querySelectorAll('#navigationMenu ul li');
    navItems.forEach((item: HTMLElement) => item.classList.remove('active'));
    target.closest('li')?.classList.add('active');
    this.updateActiveItem();
  }

  private updateActiveItem(): void {
    const activeItem = this.el.nativeElement.querySelector('#navigationMenu ul li.active');
    const horiSelector = this.el.nativeElement.querySelector('.hori-selector');

    if (activeItem && horiSelector) {
      const { offsetTop, offsetLeft, offsetHeight, offsetWidth } = activeItem;
      horiSelector.style.top = `${offsetTop}px`;
      horiSelector.style.left = `${offsetLeft}px`;
      horiSelector.style.height = `${offsetHeight}px`;
      horiSelector.style.width = `${offsetWidth}px`;
    }
  }

  

  // Método que será chamado no evento de scroll
  handleScroll = () => {
    const parallaxs = document.querySelectorAll('.parallax');
    const scrollPosition = window.pageYOffset;

    parallaxs.forEach((element: Element) => {
      const speed = element.classList.contains('fix-top') ? 0.01 : 0.1;
      (element as HTMLElement).style.transform = `translateY(${scrollPosition * speed}px)`;
    });

     
  }

  // Remover o listener de scroll quando o componente for destruído
  ngOnDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }











  Nav = [
    { 
      label: 'Piquete',  
      selected: false, 
      url: '/piips/sicgo/piquete',
      icon: 'fas fa-edit', 
      roles: ['operador'], // Somente Admin pode ver
    },
    { 
      label: 'Intervenientes',  
      selected: false, 
      url: '/piips/sicgo/piquete/interveniente',
      icon: 'fas bi-person-lock', 
      roles: ['admin'], // Somente Admin pode ver
    },
    
    { 
      label: 'formularios',  
      selected: false, 
      url: '/piips/sicgo/piquete/formularios',
      icon: 'bi fa-edit', 
      roles: ['admin'], // Somente Admin pode ver
    },
    { 
      label: 'empresas',  
      selected: false, 
      url: '/piips/sicgo/piquete/empresas',
      icon: 'bi bi-person-lock', 
      roles: ['admin'], 
      permissions: ['ocorrencia-update'], // Admin e Operador com essa permissão podem ver
    },
     
    
    
    
  ];

  // Handle tab click (toggle selected state)
  onTabClick(clickedTab: any): void {
    this.Nav.forEach(tab => tab.selected = false);
    clickedTab.selected = true;
  }

}
