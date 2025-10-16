import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RamosRoutingModule } from './ramos-routing.module';
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { ListarComponent } from './listar/listar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    RegistarOuEditarComponent,
    ListarComponent
  ],
  imports: [
    CommonModule,
    RamosRoutingModule,
    FormsModule,
    NgSelect2Module,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class RamosModule { }
