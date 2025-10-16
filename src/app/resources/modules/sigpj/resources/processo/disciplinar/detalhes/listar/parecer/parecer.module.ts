import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  

import { NgxPaginationModule } from 'ngx-pagination';

// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
 
import { ParecerRoutingModule } from './parecer-routing.module'; 
@NgModule({
  declarations: [   
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule, 
    NgSelect2Module,
    NgxPaginationModule,
    ParecerRoutingModule
  ]
})
export class ParecerModule { }
