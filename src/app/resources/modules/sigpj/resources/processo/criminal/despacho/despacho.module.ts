import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  

import { NgxPaginationModule } from 'ngx-pagination';

// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';

import { ListarComponent } from './listar/listar.component'; 
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';

import { DespachoRoutingModule } from './despacho-routing.module'; 
@NgModule({
  declarations: [ 
    ListarComponent,
    RegistarOuEditarComponent, 
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule, 
    NgSelect2Module,
    NgxPaginationModule,
    DespachoRoutingModule
  ]
})
export class DespachoModule { }
