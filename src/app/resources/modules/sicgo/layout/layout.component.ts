import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Renderer2, ChangeDetectorRef, Input } from '@angular/core';
import { SecureService } from '@core/authentication/secure.service';
import { FormatarDataHelper } from '@core/helper/formatarData.helper';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('content') content!: ElementRef;

  @Input() collapsed = true;
  constructor(
    private secureService: SecureService,
    private renderer: Renderer2,
    private formatarDataHelper: FormatarDataHelper,
    private cdr: ChangeDetectorRef
  ) { }


  // Método chamado após a inicialização da visualização
  ngAfterViewInit() {
    this.cdr.detectChanges(); // Força a detecção de mudanças se necessário

    if (this.sidebar?.nativeElement && this.content?.nativeElement) {
      this.renderer.setStyle(this.sidebar.nativeElement, 'left', '-300px');
      this.renderer.setStyle(this.content.nativeElement, 'margin-left', '0px');
    } else {
      console.error('Elementos não encontrados!');
    }

    window.addEventListener('scroll', this.handleScroll);

    setTimeout(() => {
      this.isSidebarCollapsed = true;
    }, 0);
  }

  isSidebarCollapsed = true;


  handleNavbarToggle(state: boolean) {
    this.isSidebarCollapsed = state;
  }

  handleSidebarState(state: boolean) {
    this.isSidebarCollapsed = state;
  }
  // Método que será chamado no evento de scroll
  handleScroll = () => {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    const parallaxs = document.querySelectorAll('.parallax');
    const parallax = document.querySelectorAll('.parallaxs');
    const scrollPosition = window.pageYOffset;

    parallax.forEach((element: Element) => {
      const speed = element.classList.contains('fix-top') ? 0.03 : 0.2;
      (element as HTMLElement).style.transform = `translateY(${scrollPosition * speed}px)`;
    });

    parallaxs.forEach((element: Element) => {
      const speed = element.classList.contains('fix-top') ? 0.01 : 0.2;
      (element as HTMLElement).style.transform = `translateY(${scrollPosition * speed}px)`;
    });

    parallaxElements.forEach((element: Element) => {
      const speed = element.classList.contains('top-top') ? 0.2 : -0.10;
      (element as HTMLElement).style.transform = `translateY(${scrollPosition * speed}px)`;
    });
  }

  // Remover o listener de scroll quando o componente for destruído
  ngOnDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }


  // orgao-assets.ts
 
  logo: string = 'assets/img/logopolice2.png';
  cor: string = 'linear-gradient(#041a4d, #041a4a, #041948)'; // Cor padrão
  cor1: string = '#041a4d'; // Cor padrão
  ngOnInit(): void {
    // Mostra a div após 4 segundos
    setTimeout(() => {
      const informativo = document.querySelector('.informativo') as HTMLElement;

      if (informativo) {  // Verifique se o elemento foi encontrado
        informativo.style.display = 'block';
        informativo.innerHTML += '<embed src="' + this.getAddress() + 'sound.mp3" autostart="true" hidden="true" loop="false">';

        // Esconde a div após 8 segundos
        setTimeout(() => {
          informativo.style.display = 'none';
        }, 500);
      } else {
        console.warn("Elemento '.informativo' não encontrado no DOM.");
      }
    }, 200);

    const orgaoSigla = this.secureService.getTokenValueDecode().orgao.sigla;

    switch (orgaoSigla) {
      case 'PIR':
        this.cor1 = '#D50000FF';
        this.cor = 'linear-gradient(#041a4d, #02023161,#02023161, #041948)';
        this.logo = 'assets/assets_sicgo/img/logo-pir-1.png';
        break; 
      case 'DTSER':
        this.cor1 = '#007CD5FF';
        this.cor = 'linear-gradient(#041a4d, #041a4a, #041948)';
        this.logo = 'assets/assets_sicgo/img/dtser.jpg';
        break;
      case 'PGF':
        this.cor = '#198754';
        this.logo = 'assets/assets_sicgo/img/logo-pgf-1.png';
        break;
      case 'PFA':
        this.cor1 = '#F7F303FF';
        this.cor = 'linear-gradient(#041a4d, #041a4a, #041948)';
        this.logo = 'assets/assets_sicgo/img/logo-fiscal-1.png';
        break;
      default:
        this.cor = 'linear-gradient(#041a4d, #041a4a, #041948)';  // Cor padrão
        this.logo = 'assets/img/logopolice2.png'; // Logo padrão
    }

    // Atualiza a variável CSS global para a cor
    document.documentElement.style.setProperty('--orgao-color', this.cor);
  }

 
  getAddress(): string {
    // Implemente a lógica para obter o endereço desejado
    return 'assets/'; // Substitua pelo endereço correto
  }
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
 
  //public today = this.data.now();
  get nomeOrgao() {
    return this.secureService.getTokenValueDecode().orgao?.sigla
  }

  public get orgaoId() {
    return this.secureService.getTokenValueDecode()?.orgao?.id;
  }

  public get orgao() {
    return this.secureService.getTokenValueDecode()?.orgao;

  }





}
