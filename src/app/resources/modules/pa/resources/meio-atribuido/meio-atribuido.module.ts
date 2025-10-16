import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeioAtribuidoRoutingModule } from './meio-atribuido-routing.module';
import { ListarComponent } from './resources/listar/listar.component';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ListarComponent
  ],
  imports: [
    CommonModule,
    MeioAtribuidoRoutingModule,
    NgSelect2Module,
    NgxPaginationModule,
    FormsModule
  ]
})
export class MeioAtribuidoModule { }
