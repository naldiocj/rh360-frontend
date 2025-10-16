import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { EmpresasRoutingModule } from './empresas-routing.module';

import { NgxPaginationModule } from 'ngx-pagination';

// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import {ListarComponent} from "./listar/listar.component" 
import { RegistroOuEditarEmpresaComponent } from './modal/registro-ou-editar-empresa/registro-ou-editar-empresa.component'; 

@NgModule({
  declarations: [  
    ListarComponent,
    RegistroOuEditarEmpresaComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    EmpresasRoutingModule,
    NgSelect2Module,
    NgxPaginationModule
  ]
})
export class EmpresasModule { }
