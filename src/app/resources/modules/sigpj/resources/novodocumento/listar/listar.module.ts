import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelect2Module } from 'ng-select2'; 
import { ListarRoutingModule } from './listar-routing.module';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { ListarComponent } from './listar.component';
import { RegistarOuEditarComponent } from '../registar-ou-editar/registar-ou-editar.component'; 

@NgModule({
  declarations: [ 
    RegistarOuEditarComponent,
    ListarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    ListarRoutingModule,
    NgxPaginationModule
  ]
})
export class ListarModule { }
