import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { AutoComponent } from './auto.component';
import { AutoRoutingModule } from './auto-routing.module';

@NgModule({
  declarations: [
    AutoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    AutoRoutingModule ,
    NgxPaginationModule
  ]
})
export class AutoModule { }
