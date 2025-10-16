import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DelituosoDetalhesRoutingModule } from './delituoso-detalhes-routing.module';
import { PerfilDelituosoComponent } from './perfil-delituoso/perfil-delituoso.component';
import { DelituosoDetalhesComponent } from './delituoso-detalhes.component';


@NgModule({
  declarations: [
    PerfilDelituosoComponent,
    DelituosoDetalhesComponent
  ],
  imports: [
    CommonModule,
    DelituosoDetalhesRoutingModule
  ]
})
export class DelituosoDetalhesModule { }
