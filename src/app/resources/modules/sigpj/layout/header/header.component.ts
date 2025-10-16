import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { SecureService } from '@core/authentication/secure.service';

@Component({
  selector: 'app-sigpj-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
public user:any
  constructor(
    private auth: AuthService,
    private secureService: SecureService
  ) { }

  ngOnInit(): void {
    this.seUser()
    //console.log("user",this.secureService.getTokenValueDecode().user )
  }

  get nomeUtilizador(){
    return this.secureService.getTokenValueDecode().user.nome_completo
  }
  seUser(){
   this.user = this.secureService.getTokenValueDecode().user
  }

  
 
    sair() {
      this.auth.logout();
    }

 
  toggle() {
    const main:HTMLElement  | any = document.querySelector("#main_")
    const asidebar:HTMLElement  | any = document.querySelector("#asidebar")


    
    if(main && asidebar){
      let asideLeft:string | any =  asidebar.style.left
      let mainLeft:string | any =  main.style.marginLeft
      if(asideLeft=="" || asideLeft=="0px"){
        asideLeft =  "-300px";
        mainLeft =  "0px"
      }else{
        asideLeft =  "0px";
        mainLeft =  "300px"
      }
      asidebar.style.left=asideLeft;
      main.style.marginLeft=mainLeft;


    }
   

  }

 

}
