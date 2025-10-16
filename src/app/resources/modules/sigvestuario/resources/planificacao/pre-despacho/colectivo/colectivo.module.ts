import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';

import { ColectivoRoutingModule } from './colectivo-routing.module';
import { RegistarComponent } from './registar/registar.component';
import { ListarComponent } from './listar/listar.component';
import { LayoutComponent } from './layout/layout.component';
import { RegistarMeiosComponent } from './registar-meios/registar-meios.component';
import { ListarMeiosComponent } from './listar-meios/listar-meios.component';


@NgModule({
  declarations: [
    RegistarComponent,
    ListarComponent,
    LayoutComponent,
    RegistarMeiosComponent,
    ListarMeiosComponent
  ],
  imports: [
    CommonModule,
    ColectivoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    NgxPaginationModule
  ]
})
export class ColectivoModule { }
