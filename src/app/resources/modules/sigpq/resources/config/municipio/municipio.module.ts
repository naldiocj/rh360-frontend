import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MunicipioRoutingModule } from './municipio-routing.module';
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { ListarComponent } from './listar/listar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';
import { ComponentsModule } from '@resources/modules/sigpq/shared/components/components.module';


@NgModule({
  declarations: [
    RegistarOuEditarComponent,
    ListarComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MunicipioRoutingModule,
    NgSelect2Module,
    ComponentsModule
  ]
})
export class MunicipioModule { }
