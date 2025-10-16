import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelect2Module } from 'ng-select2'; 
import { ArguidosRoutingModule } from './arguidos-routing.module';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { ArguidosComponent } from './arguidos.component';

@NgModule({
  declarations: [ 
    ArguidosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    ArguidosRoutingModule,
    NgxPaginationModule
  ]
})
export class ArguidosModule { }
