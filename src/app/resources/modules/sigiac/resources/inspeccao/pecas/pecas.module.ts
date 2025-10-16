import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelect2Module } from 'ng-select2'; 
import { NgxPaginationModule } from 'ngx-pagination'; 

@NgModule({
  declarations: [ 
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module, 
    NgxPaginationModule
  ]
})
export class PecasModule { }
