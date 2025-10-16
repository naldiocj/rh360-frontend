import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  

import { NgxPaginationModule } from 'ngx-pagination';

// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';

import { ListarComponent } from './listar/listar.component'; 
 

import { DetalhesRoutingModule } from './detalhes-routing.module'; 
@NgModule({
  declarations: [ 
    ListarComponent,
 
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule, 
    NgSelect2Module,
    NgxPaginationModule,
    DetalhesRoutingModule
  ]
})
export class DetalhesModule { }
