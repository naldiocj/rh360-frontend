import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CertiMilitarRoutingModule } from './certi-militar-routing.module';
import { ListarComponent } from './listar/listar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ListarComponent
  ],
  imports: [
    CommonModule,
    CertiMilitarRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class CertiMilitarModule { }
