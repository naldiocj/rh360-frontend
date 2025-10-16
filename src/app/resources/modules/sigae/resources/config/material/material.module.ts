import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialRoutingModule } from './material-routing.module';
import { ListaComponent } from './resources/lista/lista.component';

import { EditarOuRegistarComponent } from './resources/editar-ou-registar/editar-ou-registar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';


@NgModule({
  declarations: [
    ListaComponent,
    EditarOuRegistarComponent
  ],
  imports: [
    CommonModule,
    MaterialRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FormsModule,
    NgSelect2Module
  ]
})
export class MaterialModule { }
