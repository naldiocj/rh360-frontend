import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgApexchartsModule } from 'ng-apexcharts';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { ListarComponent } from './listar/listar.component';
import { RegistrarOuEditarComponent } from './registrar-ou-editar/registrar-ou-editar.component';
import { UtilizadoresRoutingModule } from './utilizadores-routing.module';


@NgModule({
  declarations: [
    ListarComponent,
    RegistrarOuEditarComponent,
  ],

  
  exports: [],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    UtilizadoresRoutingModule,
    NgSelect2Module,
    // NgApexchartsModule,
   
  ]
})
export class UtilizadoresModule { }
