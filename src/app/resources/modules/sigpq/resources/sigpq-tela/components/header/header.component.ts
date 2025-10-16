import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { AppConfig } from 'app/config/app.config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

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
  porPnaRoute = AppConfig.porPnaRoute; /* Ex: ROTA DO POR PNA */
  mgpsRoute = AppConfig.mgpsRoute; /* Ex: ROTA DO MGPS */
  sigefRoute = AppConfig.sigefRoute; /* Ex: ROTA DO SIGEF */
  paRoute = AppConfig.paRoute; /* Ex: ROTA DO PA */
  sigdocRoute = AppConfig.sigdocRoute; /* Ex: ROTA DO SIGDOC */
  posRoute = AppConfig.posRoute; /* Ex: ROTA DO POSDPQ */

  /* Fim Configurando as variaveis dinamicas para os estilos */

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  sair() {
    this.auth.logout();
  }

  get aceder_painel_piips() {
    return this.auth.user.aceder_painel_piips
  }

}
