import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  

import { NgxPaginationModule } from 'ngx-pagination';

// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
 
import { DetailsRoutingModule } from './details-routing.module'; 
import { DetailsComponent } from './details.component';
@NgModule({
  declarations: [  
    DetailsComponent 
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule, 
    NgSelect2Module,
    NgxPaginationModule,
    DetailsRoutingModule
  ]
})
export class DetailsModule { }
