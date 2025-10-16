import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule, NgChartsConfiguration } from 'ng2-charts';
import { SigpjRoutingModule } from './sigpj-routing.module';

import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { ChartComponent } from './resources/dashboard/chart/chart.component';
import { DashboardComponent } from './resources/dashboard/dashboard.component';
import { DefaultComponent } from './layout/default/default.component';
import { LoadingPageModule } from '@shared/components/loading-page.module';
import { BoxesComponent } from './resources/dashboard/boxes/boxes.component';
import { EstatisticaComponent } from './resources/dashboard/estatistica/estatistica.component';


@NgModule({
  declarations: [
    SidebarComponent, LayoutComponent, HeaderComponent, ChartComponent, DashboardComponent,
    DefaultComponent,
    BoxesComponent,
    EstatisticaComponent
  ],
  imports: [
    CommonModule,
    SigpjRoutingModule,
    NgChartsModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingPageModule
  ],
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false }}
  ]
})

export class SigpjModule { }
