import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelect2Module } from 'ng-select2'; 
import { ListarRoutingModule } from './listar-routing.module';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { ListarComponent } from './listar.component'; 
 
@NgModule({
  declarations: [ 
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
