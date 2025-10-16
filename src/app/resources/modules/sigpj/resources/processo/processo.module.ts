import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';

import { ProcessoRoutingModule  } from './processo-routing.module';
import { NgSelect2Module } from 'ng-select2';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ProcessoRoutingModule,
    NgSelect2Module
  ]
})
export class ProcessoModule { }
