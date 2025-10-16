import { OnInit, Component, Renderer2, ViewChild, ElementRef, HostListener } from '@angular/core';
import { OcorrenciaService } from '../../core/service/ocorrencia.service';
import { Observable, Subscriber, finalize } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { SecureService } from '@core/authentication/secure.service';
import { AuthService } from '@core/authentication/auth.service';
import { Auth } from '@shared/models/auth.model';
@Component({
  selector: 'app-sigop-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('navigationMenu') navigationMenu!: ElementRef;
   public setup: Auth
    public orgaoId: any;
    public orgaoSigla: any;  
    public ocorrencias: any;
  occurrences: any[] = [];
   getTotal: any;
  getPercente: any;
  state: string | undefined;  // Define a propriedade 'state'
  activeItem: HTMLElement | null = null;
  
  constructor(
    private ocorrenciaService: OcorrenciaService,
    private renderer: Renderer2,
    private el: ElementRef,
    private secureService: SecureService,
    private authService: AuthService) {
        this.setup = this.secureService.getTokenValueDecode();
        this.orgaoId = this.getNomeOrgao;
        this.orgaoSigla = this.getOrgaoSigla;
      }
    
    ngOnInit(): void {
          this.updateActiveItem(); 
    }
  
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
   
    public get getOrgaoSigla() {
      return this.secureService.getTokenValueDecode()?.orgao?.sigla
    }
  
    public get getNomeOrgao(): any {
      return this.secureService.getTokenValueDecode()?.orgao?.nome_completo;
    }

    public get getModulo() {
      return this.authService?.user?.aceder_todos_agentes ?
        'DPQ - DIRECÇÃO DE PESSOAL E QUADROS ' :
        `${this.setup.orgao?.sigla} - ${this.setup.orgao?.nome_completo}`;
    }
    
  
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
  
    

  private buscarOcorrencias(): void {
    this.ocorrenciaService
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (response: any) => {
          this.ocorrencias = response;
          this.getTotal = this.ocorrencias.length;
          this.getPercente = this.ocorrencias.length;
        },
      });
  }


    }




