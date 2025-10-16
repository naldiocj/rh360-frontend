import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'app/config/app.config';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css']
})
export class MainContentComponent implements OnInit {

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

  constructor() { }

  ngOnInit(): void {
    document.documentElement.style.setProperty(
      '--background-imgg',
      `url('${AppConfig.backgroundImage}')`
    );

    // Exemplo para outra variável, como você mencionou
    document.documentElement.style.setProperty(
      '--use-gradiente',
      AppConfig.useGradient
    );
  }

  redirecionarPara(link: string) {
    window.location.href = link; // Redireciona para o Google
  }

  public projectos = [
    {
      id: crypto.randomUUID,
      sigla: 'PORPNA',
      nome: 'Portal de Recrutamento da Polícia Nacional',
      logo: '/assets/img-tela/tela (5).png',
      link: 'www.google.com',
      domain: false
    },
    {
      id: crypto.randomUUID,
      sigla: 'SIGEF',
      nome: ' Gestão Formativa',
      logo: '/assets/img-tela/tela (6).png',
      link: 'http://10.110.71.5:8787',
      domain: false
    },
    {
      id: crypto.randomUUID,
      sigla: 'SIGPQ',
      nome: 'Gestão de Pessoal',
      logo: '/assets/img-tela/tela (2).png',
      link: '/piips/sigpg/dashboard',
      domain: true
    },
    {
      id: crypto.randomUUID,
      sigla: 'MGPS',
      nome: 'Protecção Social',
      logo: '/assets/img-tela/tela (3).png',
      link: '/piips/sigps/dashboard',
      domain: false
    },
    {
      id: crypto.randomUUID,
      sigla: 'SIGDOC',
      nome: 'Gestão Documental',
      logo: '/assets/img-tela/tela (4).png',
      link: null,
      domain: false
    },
    {
      id: crypto.randomUUID,
      sigla: 'POS',
      nome: 'Ordem de Serviços',
      logo: '/assets/img-tela/tela (1).png',
      link: 'http://posdpq.pna.ao',
      domain: false
    },
    {
      id: crypto.randomUUID,
      sigla: 'PA',
      nome: 'Portal do Agente',
      logo: '/assets/img-tela/tela (3).png',
      link: '/piips/pa',
      domain: true
    },

  ]

  trackProjectos(obj: any, index: number) {
    return obj?.id
  }
}
