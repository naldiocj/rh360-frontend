import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';

import { DesignacaoDeNormaPessoasRoutingModule } from './designacao-de-norma-pessoas-routing.module';
import { ListarComponent } from './listar/listar.component';
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';


@NgModule({
  declarations: [
    ListarComponent,
    RegistarOuEditarComponent
  ],
  imports: [
    CommonModule,
    DesignacaoDeNormaPessoasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    NgxPaginationModule
  ]
})
export class DesignacaoDeNormaPessoasModule { }
