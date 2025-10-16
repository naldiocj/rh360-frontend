import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgApexchartsModule } from 'ng-apexcharts';
import { ListarComponent } from './listar/listar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';
import { FuncoesRoutingModule } from './funcoes.routing.module';
import { RegistrarOuEditarComponent } from './registrar-ou-editar/registrar-ou-editar.component';


@NgModule({
    declarations: [
      ListarComponent,
      RegistrarOuEditarComponent
    ],
    imports: [
      FormsModule,
      CommonModule,
      ReactiveFormsModule,
      NgxPaginationModule,
      NgSelect2Module,
      FuncoesRoutingModule,
    ]
  })
  
  export class FuncoesModule { }
  