import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { SecureService } from '@core/authentication/secure.service';

@Component({
  selector: 'app-sigop-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() logo: string = '';
  @Input() cor: string = ''; // Recebe a cor
  @Input() corb: string = ''; // Recebe a cor

  constructor(private auth: AuthService,
    private secureService: SecureService) { }

  ngOnInit(): void {
   }

  get nomeUtilizador(){
    return this.secureService.getTokenValueDecode().user.nome_completo
  }
 
  get orgao() {
    return this.secureService.getTokenValueDecode().orgao.sigla
}

get permissions() {
    return this.secureService.getTokenValueDecode()?.permissions
}

get pessoa() {
    return this.secureService.getTokenValueDecode()?.pessoa
}

get role() {
    return this.secureService.getTokenValueDecode()?.role
}

  sair() {
    this.auth.logout();
  }

 
  
  isMobileMenuActive = false;

  toggleMobileMenu() {
    this.isMobileMenuActive = !this.isMobileMenuActive;
    const menu = document.querySelector('.header-nav_ > ul');
    if (menu) {
      menu.classList.toggle('active');
    }
  }



  isDarkMode = false;

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    const body = document.querySelector('body');
    if (this.isDarkMode) {
      body?.classList.add('dark');
    } else {
      body?.classList.remove('dark');
    }
  }
}
