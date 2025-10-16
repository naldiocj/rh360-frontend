import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination'; 

import { EmTempoRoutingModule } from './em-tempo-routing.module';

import { ListarComponent } from './listar/listar.component';
import { PromoverModalComponent } from './promover-modal/promover-modal.component';


@NgModule({
  declarations: [ 
    ListarComponent,
    PromoverModalComponent
  ],
  // exports: [RegistarOuEditarModalComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    EmTempoRoutingModule,
    NgSelect2Module
  ]
})
export class EmTempoModule { }
