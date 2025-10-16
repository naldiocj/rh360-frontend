import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilizadorSistemaRoutingModule } from './utilizador-sistema-routing.module';
import { ViewUtilizadorSistemaComponent } from './view-utilizador-sistema/view-utilizador-sistema.component';
import { ListarComponent } from './listar/listar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [

    ViewUtilizadorSistemaComponent,
    ListarComponent
  ],
  imports: [
    CommonModule,
    UtilizadorSistemaRoutingModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class UtilizadorSistemaModule { }
