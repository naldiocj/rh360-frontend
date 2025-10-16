import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { DespachoRoutingModule } from './despacho-routing.module';
import { DespachoComponent } from './despacho.component';

@NgModule({
  declarations: [
    DespachoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    DespachoRoutingModule,
    NgxPaginationModule
  ]
})
export class DespachoModule { }
