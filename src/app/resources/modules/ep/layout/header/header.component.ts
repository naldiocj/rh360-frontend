import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { SecureService } from '@core/authentication/secure.service';
import { AuthGuard } from '@core/guards/auth.guard';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private secureService: SecureService) { }

  ngOnInit(): void {
  }

  verNotificacoes() { }

  sair() {
    this.auth.logout();
  }

  get nomeUtilizador(){
    return this.secureService.getTokenValueDecode().user.nome_completo
  }

}
