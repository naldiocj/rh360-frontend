import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { CACRoutingModule } from './cac-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import {ListarComponent} from "./listar/listar.component"
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component'; 
import { DadosQueixosoComponent } from './registar-ou-editar/dados-queixoso/registar-ou-editar.component';
import { DadosAcusadoComponent } from './registar-ou-editar/dados-acusado/registar-ou-editar.component';
import { DadosQueixaComponent } from './registar-ou-editar/dados-queixa/registar-ou-editar.component';


@NgModule({
  declarations: [
    RegistarOuEditarComponent,
    ListarComponent,
    DadosQueixosoComponent,
    DadosAcusadoComponent,
    DadosQueixaComponent,

  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    CACRoutingModule,
    NgSelect2Module,
    NgxPaginationModule
  ]
})
export class CACModule { }
