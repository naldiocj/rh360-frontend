import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstatisticaRoutingModule } from './estatistica-routing.module';
import { LayoutComponent } from './layout/layout.component';


@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    EstatisticaRoutingModule
  ]
})
export class EstatisticaModule { }
