import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisciplinarRoutingModule } from './disciplinar-routing.module';

import { NgxPaginationModule } from 'ngx-pagination';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { ListarComponent } from "./listar/listar.component"
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { LoadingPageModule } from '@shared/components/loading-page.module';

@NgModule({
  declarations: [
    RegistarOuEditarComponent,
    ListarComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DisciplinarRoutingModule,
    NgSelect2Module,
    NgxPaginationModule,
    LoadingPageModule
  ]
})
export class DisciplinarModule { }
