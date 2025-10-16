import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination'; 

import { FuncaoRoutingModule } from './funcao-routing.module';
import { ListarComponent } from './listar/listar.component';
import { RegistarOuEditarModalComponent } from './registar-ou-editar/registar-ou-editar-modal.component';
import { ComponentsModule } from '@resources/modules/sigpq/shared/components/components.module';
import { ListarOuRegistarComponent } from './permissao/listar-ou-registar/listar-ou-registar.component';


@NgModule({
  declarations: [ 
    ListarComponent,
    RegistarOuEditarModalComponent,
    ListarOuRegistarComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FuncaoRoutingModule,
    NgSelect2Module,
    ComponentsModule
  ]
})
export class FuncaoModule { }
