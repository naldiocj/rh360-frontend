import { Component, OnInit, Renderer2} from '@angular/core';
import { SecureService } from '../../../../../../core/authentication/secure.service';
import { AuthService } from '../../../../../../core/authentication/auth.service';
import { TokenData } from '../../../../../../shared/models/token.model';
import { AppConfig } from '../../../../../../config/app.config';

@Component({
  selector: 'app-barra-superior-dashboard',
  templateUrl: './barra-superior-dashboard.component.html',
  styleUrls: ['./barra-superior-dashboard.component.css']
})
export class BarraSuperiorDashboardComponent implements OnInit {
  dashboards: any = []
  public setup: TokenData
  public direcaoNome: string = ''
  isLoading: boolean = false

  /* Configurando as variaveis dinamicas para os estilos */

  tituloPrincipal = AppConfig.orgName; /* Ex: Policia Nacional de Angola OU Serviços  I ... */
  introApp = AppConfig.introApp; /* Ex: Sistema Integrado de Gestao de pessoal e quadros */
  siglaPrincipal = AppConfig.siglaPrincipal; /* Ex: PNA */
  logoPath = AppConfig.logoPath; /* Ex: LOGOTIPO */
  logoBack = AppConfig.logoBack; /* Ex: LOGOTIPO DE FUNDO */

  /* Fim Configurando as variaveis dinamicas para os estilos */

  constructor(
    private secureService: SecureService,
    private authService: AuthService,
    private renderer: Renderer2) {
    this.setup = this.secureService.getTokenValueDecode();
  }

  ngOnInit(): void {
    /* Configurando a variavel do css com render */
    this.renderer.setStyle(document.documentElement, '--use-color', AppConfig.useColor);
  }


  public get getModulo() {
    /* return this.authService?.user?.aceder_todos_agentes ?
      'DPQ - DIRECÇÃO DE PESSOAL E QUADROS ' :
      `${this.setup.orgao?.sigla} - ${this.setup.orgao?.nome_completo}`; */
    const orgao = this.setup.orgao || {};
    return `${orgao.sigla || ''} - ${orgao['nome_completo'] || ''}`;
  }


}
