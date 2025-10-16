import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidatoRoutingModule } from './candidato-routing.module';
import { ListarComponent } from './listar/listar.component';
import { VisualizarComponent } from './visualizar/visualizar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListarComponent,
    VisualizarComponent
  ],
  imports: [
    CommonModule,
    CandidatoRoutingModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class CandidatoModule { }
