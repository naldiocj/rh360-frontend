import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvinciasRoutingModule } from './provincias-routing.module';
import { ListarComponent } from './listar/listar.component';
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';
import { ComponentsModule } from '@resources/modules/sigpq/shared/components/components.module';


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
    ProvinciasRoutingModule,
    NgSelect2Module,
    ComponentsModule
  ]
})
export class ProvinciasModule { }
