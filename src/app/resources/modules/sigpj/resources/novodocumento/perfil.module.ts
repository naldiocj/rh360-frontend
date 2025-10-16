import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { PerfilRoutingModule } from './perfil-routing.module';

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
    PerfilRoutingModule,
    NgSelect2Module,
    NgxPaginationModule
  ]
})
export class PerfilModule { }
