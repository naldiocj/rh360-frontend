import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { NotificacaoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/notificacao/notificacao.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.component.html',
  styleUrls: ['./notificacoes.component.css']
})
export class NotificacoesComponent implements OnInit {
   notifica: any[] = [];
  
 
 
   public isLoading: boolean = false 
 
 
   public delituoso: any;
 
   constructor(
     public authService: AuthService,
     private notificacaoService: NotificacaoService) { }
 
 
   ngOnInit() {
     this.Notifica() 
     
   }
 
 
 
   get permissions() {
     return this.authService?.permissions || [];
   }
   
   get role() {
     return this.authService?.role?.name?.toString().toLowerCase();
   }
    
 
 
 
   Notifica() {
     const options = {};
     this.notificacaoService
       .listarTodos({})
       .pipe(finalize(() => { }))
       .subscribe({
         next: (response: any) => {
           this.notifica = response
         },
       });
   }

}
