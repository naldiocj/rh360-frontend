import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { AcusadoComponent } from './acusado.component';
import { AcusadoRoutingModule } from './acusado-routing.module';

@NgModule({
  declarations: [
    AcusadoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    NgxPaginationModule,
    AcusadoRoutingModule
  ]
})
export class AcusadoModule { }
