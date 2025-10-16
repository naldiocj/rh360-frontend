import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GraduacaoRoutingModule } from './graduacao-routing.module';
import { HistoricoRoutingModule } from './historico/historico-routing.module';

@NgModule({
  declarations: [ 
  ],
  imports: [
    CommonModule,
    GraduacaoRoutingModule,
    HistoricoRoutingModule
  ]
})
export class GraduacaoModule { }
