import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelect2Module } from 'ng-select2';  
import { NgxPaginationModule } from 'ngx-pagination'; 
import { RegistarOuEditarRoutingModule } from './registar-ou-editar-routing.module';
import { RegistarOuEditarComponent } from './registar-ou-editar.component';


@NgModule({
  declarations: [ 
    RegistarOuEditarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module, 
    NgxPaginationModule,
    RegistarOuEditarRoutingModule
  ]
})
export class RegistarOuEditarModule { }
