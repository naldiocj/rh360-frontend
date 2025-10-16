import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarComponent } from './listar/listar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { VitimaRoutingModule } from './vitima-routing.module';



@NgModule({
  declarations: [
    ListarComponent
  ],
  imports: [
    CommonModule,
    VitimaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    NgxPaginationModule
  ]
})
export class VitimaModule { }
