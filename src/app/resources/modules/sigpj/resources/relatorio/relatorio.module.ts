import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 

import { NgxPaginationModule } from 'ngx-pagination';

import { RelatorioRoutingModule  } from './relatorio-routing.module'; 
import { NgSelect2Module } from 'ng-select2';  
@NgModule({
  declarations: [ 
   
  ], 
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    NgxPaginationModule,
    RelatorioRoutingModule,
    NgSelect2Module
  ]
})
export class RelatorioModule { }
