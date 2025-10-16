import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardSicgoDinfopComponent } from './dashboard-sicgo-dinfop/dashboard-sicgo-dinfop.component';
import { DashboardSicgoOcorrenciaComponent } from './dashboard-sicgo-ocorrencia/dashboard-sicgo-ocorrencia.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { DashboardComponent } from './dashboard.component';
import { SharedcomponentsModule } from '../../shared/components/sharedcomponents.module';
import { NgChartsModule } from 'ng2-charts';
import { DashboardSicgoDinfopGrupoComponent } from './dashboard-sicgo-dinfop/dashboard-sicgo-dinfop-grupo/dashboard-sicgo-dinfop-grupo.component';


@NgModule({
  declarations: [
    DashboardSicgoDinfopComponent,
    DashboardSicgoOcorrenciaComponent,
    DashboardSicgoDinfopGrupoComponent,
    
  ],
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    DashboardRoutingModule,
    NgxPaginationModule, 
    NgSelect2Module,
    SharedcomponentsModule,
    NgChartsModule,
    FormsModule,
    NgSelect2Module,
  ]
})
export class DashboardModule { }
