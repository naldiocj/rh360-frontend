import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { DadosRoutingModule } from './dados-routing.module';

import { NgxPaginationModule } from 'ngx-pagination';

// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import {ListarComponent} from "./listar/listar.component"
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component'; 

@NgModule({
  declarations: [ 
    RegistarOuEditarComponent,
    ListarComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DadosRoutingModule,
    NgSelect2Module,
    NgxPaginationModule
  ]
})
export class DadosModule { }
