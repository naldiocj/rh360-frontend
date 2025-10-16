import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassificacaoRoutingModule } from './classificacao-routing.module';
import { RegistarOuEditarComponent } from './resources/registar-ou-editar/registar-ou-editar.component';
import { ListaComponent } from './resources/lista/lista.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';


@NgModule({
  declarations: [
    RegistarOuEditarComponent,
    ListaComponent
  ],
  imports: [
    CommonModule,
    ClassificacaoRoutingModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module
  ]
})
export class ClassificacaoModule { }
