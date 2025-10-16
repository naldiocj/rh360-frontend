import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TratamentoMobilidadeRoutingModule } from './tratamento-mobilidade-routing.module';
import { RegistarOuEditarComponent } from './resources/registar-ou-editar/registar-ou-editar.component';
import { ListarComponent } from './resources/listar/listar.component';
import { VerUmComponent } from './resources/ver-um/ver-um.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RegistarOuEditarComponent,
    ListarComponent,
    VerUmComponent
  ],
  imports: [
    CommonModule,
    TratamentoMobilidadeRoutingModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    RegistarOuEditarComponent
  ]
})
export class TratamentoMobilidadeModule { }
