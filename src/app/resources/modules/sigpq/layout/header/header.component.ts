import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { SecureService } from '@core/authentication/secure.service';
import { SocketNotificacaoService } from '../../core/service/socket/socket-notificacao.service';
import { AppConfig } from '../../../../../config/app.config';

@Component({
  selector: 'app-sigpq-header',
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

  /* Fim Configurando as variaveis dinamicas para os estilos */

  constructor(public auth: AuthService, private socketNotificacaoService: SocketNotificacaoService, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.buscarNotificacao()
    /* Configurando a variavel do css com render */
    document.documentElement.style.setProperty('--use-color', AppConfig.useColor);
  }

  notifications: any = [
    /* {
      id: 1,
      user: 'João Silva',
      message: 'Solicitou uma licença.',
      tye:'licenca',
      time: 'há 5 minutos',
    },
    {
      id: 2,
      user: 'Maria Souza',
      message: 'Comentou na sua publicação.',
      tye:'licenca',
      time: 'há 1 hora',
    },
    {
      id: 3,
      user: 'Carlos Oliveira',
      message: 'Reagiu à sua mensagem.',
      tye:'licenca',
      time: 'há 2 horas',
    }, */
  ];

  temAlertas: boolean = true
  private buscarNotificacao() {
    this.socketNotificacaoService.ouvindoEm('sigpq:notificacao').pipe().subscribe({
      next: (response: any) => {
        if (response?.id && response?.user) {
          this.notifications.push(response)
        }
        console.log("Notificação:", response)
      }
    })
  }
  get nomeUtilizador() {
    return this.auth.user.nome_completo
  }


  get aceder_painel_piips() {
    return this.auth.user.aceder_painel_piips
  }

  sair() {
    this.auth.logout();
  }


  toggle() {
    const main: HTMLElement | any = document.querySelector("#main_")
    const asidebar: HTMLElement | any = document.querySelector("#asidebar")



    if (main && asidebar) {
      let asideLeft: string | any = asidebar.style.left
      let mainLeft: string | any = main.style.marginLeft
      if (asideLeft == "" || asideLeft == "0px") {
        asideLeft = "-300px";
        mainLeft = "0px"
      } else {
        asideLeft = "0px";
        mainLeft = "300px"
      }
      asidebar.style.left = asideLeft;
      main.style.marginLeft = mainLeft;


    }


  }

}
