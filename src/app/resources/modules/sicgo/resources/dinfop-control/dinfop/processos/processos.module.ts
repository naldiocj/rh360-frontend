import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ProcessosRoutingModule } from './processos-routing.module';

import { NgxPaginationModule } from 'ngx-pagination';

// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import {ListarComponent} from "./listar/listar.component"
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { ProcessosViewComponent } from './processos-view/processos-view.component'; 
import { PiqueteModule } from '../../../piquete/piquete.module';
import { RegistarInstrutorComponent } from './modal/Instrutores/registar-instrutor/registar-instrutor.component';
import { ListaInstrutorComponent } from './modal/Instrutores/lista-instrutor/lista-instrutor.component';

@NgModule({
  declarations: [ 
    RegistarOuEditarComponent,
    ListarComponent,
    ProcessosViewComponent,
    RegistarInstrutorComponent,
    ListaInstrutorComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ProcessosRoutingModule,
    NgSelect2Module,
    NgxPaginationModule,
    PiqueteModule
  ]
})
export class ProcessosModule { }
