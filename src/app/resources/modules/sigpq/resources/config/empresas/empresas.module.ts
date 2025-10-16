import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';

import { empresasRoutingModule } from './empresas-routing.module';

import { ListarComponent } from './listar/listar.component';
import { RegistarOuEditarModalComponent } from './registar-ou-editar/registar-ou-editar-modal.component';
import { ComponentsModule } from '@resources/modules/sigpq/shared/components/components.module';
import { DeleteComponent } from './delete/delete.component';


@NgModule({
  declarations: [
    ListarComponent,
    RegistarOuEditarModalComponent,
    DeleteComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    empresasRoutingModule,
    NgSelect2Module,
    ComponentsModule
  ]
})
export class empresasModule { }
