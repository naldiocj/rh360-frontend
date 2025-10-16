import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromocaoRoutingModule } from './promocao-routing.module';
import { HistoricoRoutingModule } from './historico/historico-routing.module';
import { LoadingPageModule } from '@shared/components/loading-page.module';


@NgModule({
  declarations: [ 
  ],
  imports: [
    CommonModule,
    PromocaoRoutingModule,
    HistoricoRoutingModule,
    LoadingPageModule,
   
  ]
})
export class PromocaoModule { }
