import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/service/Dashboard.service';
import { finalize } from 'rxjs';
import { UrlService } from '../../../../../../core/helper/Url.helper';

@Component({
  selector: 'app-tela-especial',
  templateUrl: './tela-especial.component.html',
  styleUrls: ['./tela-especial.component.css']
})
export class TelaEspecialComponent implements OnInit {

  constructor(private url: UrlService,public dashboardService:DashboardService) { }


  ngOnInit() {
    this.buscarDashboards()
  }

  isLoading:boolean=false
  buscarDashboards() {
    this.isLoading = true;
    if(this.dashboardService.data_dashboard?.resumo) {this.isLoading = false; return}

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

}
