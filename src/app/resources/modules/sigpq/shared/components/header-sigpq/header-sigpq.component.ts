import { Component, OnInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { AppConfig } from '../../../../../../config/app.config';
@Component({
  selector: 'sigpq-header',
  templateUrl: './header-sigpq.component.html',
  styleUrls: ['./header-sigpq.component.css']
})
export class HeaderSigpqComponent implements OnInit {

  /* Configurando as variaveis dinamicas para os estilos */

  tituloPrincipal = AppConfig.orgName; /* Ex: Policia Nacional de Angola OU Serviços  I ... */
  slogan = AppConfig.slogan; /* Ex: Policia Nacional de Angola OU Serviços  I ... */
  introApp = AppConfig.introApp; /* Ex: Sistema Integrado de Gestao de pessoal e quadros */
  siglaPrincipal = AppConfig.siglaPrincipal; /* Ex: PNA */
  logoPath = AppConfig.logoPath; /* Ex: LOGOTIPO */
  logoBack = AppConfig.logoBack; /* Ex: LOGOTIPO DE FUNDO */

  /* Fim Configurando as variaveis dinamicas para os estilos */

  constructor(
    private location: Location,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    /* Configurando a variavel do css com render */
        this.renderer.setStyle(document.documentElement, '--use-color', AppConfig.useColor);
  }
  voltar() {
    this.location.back();
  }

}
