import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoliciaNacionalRoutingModule } from './policia-nacional-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { CardComponent } from './card/card.component';


@NgModule({
  declarations: [
    LayoutComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    PoliciaNacionalRoutingModule
  ]
})
export class PoliciaNacionalModule { }
