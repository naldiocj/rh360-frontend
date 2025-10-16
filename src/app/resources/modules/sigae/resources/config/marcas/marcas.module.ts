import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarcasRoutingModule } from './marcas-routing.module';
import { ListaComponent } from './resources/lista/lista.component';
import { RegistarOuEditarComponent } from './resources/registar-ou-editar/registar-ou-editar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';


@NgModule({
  declarations: [
    ListaComponent,
    RegistarOuEditarComponent,
    
  ],
  imports: [
    CommonModule,
    MarcasRoutingModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelect2Module
  ]
})
export class MarcasModule { }
