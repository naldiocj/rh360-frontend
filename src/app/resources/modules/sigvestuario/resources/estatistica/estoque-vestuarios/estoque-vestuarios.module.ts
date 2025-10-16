import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';

import { EstoqueVestuariosRoutingModule } from './estoque-vestuarios-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { CardsComponent } from './cards/cards.component';


@NgModule({
  declarations: [
    LayoutComponent,
    CardsComponent
  ],
  imports: [
    CommonModule,
    EstoqueVestuariosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    NgxPaginationModule
  ]
})
export class EstoqueVestuariosModule { }
