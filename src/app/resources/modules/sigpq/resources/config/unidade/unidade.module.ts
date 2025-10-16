import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnidadeRoutingModule } from './unidade-routing.module';
import { ListarComponent } from './listar/listar.component';
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { ComponentsModule } from '@resources/modules/sigpq/shared/components/components.module';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListarComponent,
    RegistarOuEditarComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    UnidadeRoutingModule,
    NgSelect2Module,
    ComponentsModule
  ]
})
export class UnidadeModule { }
