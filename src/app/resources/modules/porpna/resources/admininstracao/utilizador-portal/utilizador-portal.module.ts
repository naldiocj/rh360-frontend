import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilizadorPortalRoutingModule } from './utilizador-portal-routing.module';
import { ListarComponent } from './listar/listar.component';
import { ViewUtilizadorPortalComponent } from './view-utilizador-portal/view-utilizador-portal.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ListarComponent,
    ViewUtilizadorPortalComponent
  ],
  imports: [
    CommonModule,
    UtilizadorPortalRoutingModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UtilizadorPortalModule { }
