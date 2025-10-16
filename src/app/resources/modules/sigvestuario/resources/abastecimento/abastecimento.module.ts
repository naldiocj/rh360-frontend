import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AbastecimentoRoutingModule } from './abastecimento-routing.module';
import { LayoutComponent } from './layout/layout.component';


@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    AbastecimentoRoutingModule
  ]
})
export class AbastecimentoModule { }
