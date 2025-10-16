import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArmasRoutingModule } from './armas-routing.module';
import { RegistarOuEditarComponent } from './resources/registar-ou-editar/registar-ou-editar.component';
import { ListaComponent } from './resources/lista/lista.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { InformacaoArmaComponent } from '../informacao-arma/informacao-arma.component';
import { AtribuirArmaComponent } from './resources/atribuir-arma/atribuir-arma.component';


@NgModule({
  declarations: [
    RegistarOuEditarComponent,
    ListaComponent,
    InformacaoArmaComponent,
    AtribuirArmaComponent
  ],
  imports: [
    CommonModule,
    ArmasRoutingModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelect2Module
  ]
})
export class ArmasModule { }
