import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';

import { TipoDeNormaPessoasRoutingModule } from './tipo-de-norma-pessoas-routing.module';
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { ListarComponent } from './listar/listar.component';


@NgModule({
  declarations: [
    RegistarOuEditarComponent,
    ListarComponent
  ],
  imports: [
    CommonModule,
    TipoDeNormaPessoasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    NgxPaginationModule
  ]
})
export class TipoDeNormaPessoasModule { }
