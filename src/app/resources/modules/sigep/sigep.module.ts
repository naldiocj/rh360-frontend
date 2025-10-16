import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule, NgChartsConfiguration } from 'ng2-charts';

import { SigepRoutingModule } from './sigep-routing.module';

import { NavbarComponent } from './layout/navbar/navbar.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ChartComponent } from './resources/dashboard/chart/chart.component';
import { DashboardComponent } from './resources/dashboard/dashboard.component';
import { DefaultComponent } from './layout/default/default.component';

//menus
 


@NgModule({
  declarations: [
    NavbarComponent,
    LayoutComponent,
    FooterComponent,
    HeaderComponent,
    ChartComponent,
    DashboardComponent,
    DefaultComponent,
 

  ],
  imports: [
    CommonModule,
    SigepRoutingModule,
    NgChartsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false } },
  ],
})
export class SigepModule {}
