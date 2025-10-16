import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../core/service/Dashboard.service';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isLoading: boolean = false
  dashboards: any = []

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.buscarDashboards()
  }

  buscarDashboards() {
    this.isLoading = true;
    this.dashboardService.listar_todos().pipe(
      finalize(() => {
        this.isLoading = false;
      }),
    ).subscribe((response) => {
      this.dashboards = response
    });
  }

}
