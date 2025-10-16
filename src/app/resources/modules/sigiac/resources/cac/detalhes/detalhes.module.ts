import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  

import { NgxPaginationModule } from 'ngx-pagination';

// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
 
 

import { DetalhesRoutingModule } from './detalhes-routing.module'; 
import { DetalhesComponent } from './detalhes.component';
@NgModule({
  declarations: [   
    DetalhesComponent
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
