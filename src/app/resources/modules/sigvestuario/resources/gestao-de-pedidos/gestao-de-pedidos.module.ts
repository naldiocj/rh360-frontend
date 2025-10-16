import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';

import { GestaoDePedidosRoutingModule } from './gestao-de-pedidos-routing.module';
import { LayoutComponent } from './layout/layout.component';


@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    GestaoDePedidosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    NgxPaginationModule
  ]
})
export class GestaoDePedidosModule { }
