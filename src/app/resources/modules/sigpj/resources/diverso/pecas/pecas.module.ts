import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelect2Module } from 'ng-select2';
import { PecasComponent } from './pecas.component';
import { PecasRoutingModule } from './pecas-routing.module';
import { NgxPaginationModule } from 'ngx-pagination'; 

@NgModule({
  declarations: [
    PecasComponent 
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    PecasRoutingModule,
    NgxPaginationModule
  ]
})
export class PecasModule { }
