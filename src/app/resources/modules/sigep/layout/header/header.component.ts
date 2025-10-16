import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { SecureService } from '@core/authentication/secure.service';

@Component({
  selector: 'app-sigop-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  

  constructor(private auth: AuthService,
    private secureService: SecureService) { }

  ngOnInit(): void {
    
    //console.log("user",this.secureService.getTokenValueDecode().user )
  }

  get nomeUtilizador(){
    return this.secureService.getTokenValueDecode().user.nome_completo
  }
 
  sair() {
    this.auth.logout();
  }

 

}
