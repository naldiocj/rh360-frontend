import { Component, OnInit } from '@angular/core';
import { UrlService } from '../../../../../../core/helper/Url.helper';
import { DashboardService } from '../../../core/service/Dashboard.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-tela-principal',
  templateUrl: './tela-principal.component.html',
  styleUrls: ['./tela-principal.component.css']
})
export class TelaPrincipalComponent implements OnInit {

  constructor(private url: UrlService,public dashboardService:DashboardService) { }

  regimes = [
    {
      nome: 'Regime Especial',
      icon: 'bi-person-fill-check',
      index: 1,
      tipo: 'especial',
      rotaActivo: 'efectivo-especial-activo',
      rotaPassivo: 'efectivo-especial-passivo',
      rotaInactivo: 'efectivo-especial-inactivo'
    },
    {
      nome: 'Regime Geral',
      icon: 'bi-person-fill-add',
      index: 2,
      tipo: 'geral',
      rotaActivo: 'efectivo-geral-activo',
      rotaPassivo: 'efectivo-geral-passivo',
      rotaInactivo: 'efectivo-geral-inactivo'
    }
  ];

  ngOnInit() {
    this.buscarDashboards()
  }

  isLoading:boolean=false
  buscarDashboards() {
    this.isLoading = true;
    //if(this.dashboardService.data_dashboard?.resumo) {this.isLoading = false; return}

      this.dashboardService.listar_todos_nova_estrutura().pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      ).subscribe((response) => {
        //this.dashboards = response
        this.dashboardService.data_dashboard=response
        console.log("Dados da nova estrutura:",response)
      });


  }

  redirect(url: any) {

    const params = url;

    this.url.url_direct('/sigpg/dashboard/'+params);
  }

  redirectAgentes(url: any) {

    const params = url;

    this.url.url_direct('/sigpg/funcionario/'+params);
  }
}
