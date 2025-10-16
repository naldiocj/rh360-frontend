import { Component, OnInit } from '@angular/core';
import { UrlService } from '../../../../../../core/helper/Url.helper';
import { DashboardService } from '../../../core/service/Dashboard.service';
import { finalize } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-efectivo-geral',
  templateUrl: './efectivo-geral.component.html',
  styleUrls: ['./efectivo-geral.component.css']
})
export class EfectivoGeralComponent implements OnInit {


   dashboards:any=[
       /* {nome:'Efectivos do Regime Especial',total:19999,url:'',icon:'perfil-d bi bi-person-circle'},
       {nome:'Oficial Comissário',total:900,url:'efectivo-especial',icon:'perfil-d bi bi-person-bounding-box'},
       {nome:'Oficial Superior',total:850,url:'efectivo-geral',icon:'perfil-d bi bi-file-person-fill'},
       {nome:'Oficial Subalterno',total:840,url:'efectivo-geral',icon:'perfil-d bi bi-file-person-fill'},
       {nome:' Subchefe',total:890,url:'efectivo-geral',icon:'perfil-d bi bi-person'},
       {nome:'Agente',total:900,url:'efectivo-geral',icon:'perfil-d bi bi-person'},
       {nome:'Masculino',total:990,url:'efectivo-geral',icon:'perfil-d bi bi-file-person-fill'},
       {nome:'Feminino',total:450,url:'efectivo-geral',icon:'perfil-d bi bi-file-person-fill'}, */
     ]
     constructor(
       private route: ActivatedRoute,
         private url: UrlService,public dashboardService:DashboardService) { }

     isLoading:boolean=false
     informacao:string="activo"
     ngOnInit() {
       this.informacao = this.route.snapshot.data['informacao']|| 'activo';
       this.buscarDashboards()
     }

     buscarDashboards() {
           this.isLoading = true;
           /* if(this.dashboardService.data_dashboard?.geral_efectivo_ativo) {this.isLoading = false;
             this.dashboards=this.informacao=='activo'?this.dashboardService.data_dashboard.geral_efectivo_ativo:this.dashboardService.data_dashboard.geral_efectivo_passivo

             return
           } */

             this.dashboardService.listar_todos_nova_estrutura().pipe(
               finalize(() => {
                 this.isLoading = false;
               }),
             ).subscribe((response) => {
               //this.dashboards = response
               this.dashboardService.data_dashboard=response
               this.dashboards=this.informacao=='activo'?this.dashboardService.data_dashboard.geral_efectivo_ativo:this.informacao=='inactivo'?this.dashboardService.data_dashboard.geral_efectivo_inactivo:this.dashboardService.data_dashboard.geral_efectivo_passivo
               console.log("Dados da nova estrutura:",response)
             });


         }
 
       redirect(url: any) {
         const params = url;

         if(this.dashboards=this.informacao=='activo')this.url.url('/sigpg/funcionario/listar', params);
       else if(this.dashboards=this.informacao=='inactivo')this.url.url('/sigpg/funcionario/inactivo', params);
       else if(this.dashboards=this.informacao=='passivo')this.url.url('/sigpg/funcionario/listar-passivos', params);
       }
      }
