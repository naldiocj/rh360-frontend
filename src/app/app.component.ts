import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../app/config/app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontends';
  public color = '#000';
  public auth: boolean = false

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

  constructor(
    // private $setup: SetupState,
    // private router: Router
  ) {

    // if (!this.$setup.config) {
    //   this.$setup.loadStateFromApi();
    // }

    // this.marketplaceService.elements()
    // .subscribe(({ scripts }) => {
    //   (scripts as Array<any>).forEach((url: string) => {
    //     const script = document.createElement('script');
    //     script.async = true;
    //     script.src = `${environment.app_url_base}/${url}`;
    //     script.defer = true;
    //     script['data-stencil'] = true;
    //     document.querySelector('head').appendChild(script)
    //   })
    // })

  }

  // get colors() {
  //   return this.$setup.config && this.$setup.config.colors;
  // }

  // private get headers() {
  //   return this.$setup.config && this.$setup.config.headers;
  // }

  ngOnInit(): void {
    //   document.title = this.headers?.coreDescription ?? ''
    document.documentElement.style.setProperty('--use-color', AppConfig.useColor);
    document.documentElement.style.setProperty('--color-painel', AppConfig.colorPainel);
    document.documentElement.style.setProperty('--use-gradiente', AppConfig.useGradient);
  }
}