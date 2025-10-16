import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelosRoutingModule } from './modelos-routing.module';

import { EditarOuRegistarComponent } from './resources/editar-ou-registar/editar-ou-registar.component';
import { ListaComponent } from './resources/lista/lista.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';


@NgModule({
  declarations: [
    EditarOuRegistarComponent,
    ListaComponent
  ],
  imports: [
    CommonModule,
    ModelosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgSelect2Module

  ]
})
export class ModelosModule { }
