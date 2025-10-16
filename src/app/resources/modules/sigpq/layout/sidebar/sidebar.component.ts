import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { AppConfig } from '../../../../../config/app.config';

@Component({
  selector: 'app-sigpq-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {

  /* Configurando as variaveis dinamicas para os estilos */

  tituloPrincipal = AppConfig.orgName; /* Ex: Policia Nacional de Angola OU Serviços  I ... */
  introApp = AppConfig.introApp; /* Ex: Sistema Integrado de Gestao de pessoal e quadros */
  siglaPrincipal = AppConfig.siglaPrincipal; /* Ex: PNA */
  logoPath = AppConfig.logoPath; /* Ex: LOGOTIPO */
  logoBack = AppConfig.logoBack; /* Ex: LOGOTIPO DE FUNDO */
  logoH = AppConfig.logoH; /* Ex: LOGOTIPO DE HEADER */
  imgUser = AppConfig.imgUser; /* Ex: Imagem user */
  useColor = AppConfig.useColor; /* Ex: COR DO TEMA */
  useGradient = AppConfig.useGradient; /* Ex: COR DO GRADIENTE */
  colorPainel = AppConfig.colorPainel; /* Ex: COR DO PAINEL */


  /* Fim Configurando as variaveis dinamicas para os estilos */

  menuActive: string = "dashboard";

  constructor(
    public authService: AuthService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {

    document.body.classList.remove('mini-sidebar');
    // @ts-ignore
    window.initSlideMenu();

    /* Configurando a variavel do css com render */
    this.renderer.setStyle(document.documentElement, '--use-color', AppConfig.useColor);
    document.documentElement.style.setProperty('--use-painel', AppConfig.colorPainel);
  }


  onRouterLinkActive(event: any) {
    this.menuActive = event;
  }

  private get role() {

    return this.authService?.role?.name?.toString().toLowerCase()
  }
  public get isAdmin() {
    return ['admin', 'root'].includes(this.role)
  }

}



