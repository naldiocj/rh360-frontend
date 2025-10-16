import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EspecialidadeRoutingModule } from './especialidade-routing.module';
import { ListarComponent } from './listar/listar.component';
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';


@NgModule({
  declarations: [
    ListarComponent,
    RegistarOuEditarComponent
  ],
  imports: [
    CommonModule,
    EspecialidadeRoutingModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelect2Module
  ]
})
export class EspecialidadeModule { }
