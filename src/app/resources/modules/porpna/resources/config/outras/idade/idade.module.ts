import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListarComponent } from './listar/listar.component';
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ListarComponent,
    RegistarOuEditarComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelect2Module,
    NgxPaginationModule,

  ],
  exports: [
    ListarComponent
  ]
})
export class IdadeModule { }
