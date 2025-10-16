import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoricoRoutingModule } from './historico-routing.module';

import { ListarComponent } from './listar/listar.component'; 
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ 
    ListarComponent
  ],
  // exports: [RegistarOuEditarModalComponent],
  imports: [
    FormsModule,
    CommonModule,
    NgxPaginationModule,
    HistoricoRoutingModule,
  ]
})
export class HistoricoModule { }
