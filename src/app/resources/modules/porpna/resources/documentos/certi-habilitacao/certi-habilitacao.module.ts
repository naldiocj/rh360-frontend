import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CertiHabilitacaoRoutingModule } from './certi-habilitacao-routing.module';
import { ListarComponent } from './listar/listar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ListarComponent
  ],
  imports: [
    CommonModule,
    CertiHabilitacaoRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class CertiHabilitacaoModule { }
