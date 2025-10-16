import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
  


import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [ 
  ], 
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    NgxPaginationModule,  
    AdminRoutingModule
  ]
})
export class AdminModule { }
