import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { InspeccaoRoutingModule } from './inspeccao-routing.module';

import { NgxPaginationModule } from 'ngx-pagination';

// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2'; 

@NgModule({
  declarations: [  
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    InspeccaoRoutingModule,
    NgSelect2Module,
    NgxPaginationModule
  ]
})
export class InspeccaoModule { }
