import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PassesProfissionalRoutingModule } from './passes-profissional-routing.module';
import { ListarComponent } from './listar/listar.component';
import { AgentesComponent } from './agentes/agentes.component';
import { RegistarOuEditarComponent } from './agentes/registar-ou-editar/registar-ou-editar.component';
import { ComponentsModule } from '@resources/modules/sigpq/shared/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgentesSelecionadosComponent } from './agentes/agentes-selecionados/agentes-selecionados.component';
import { LoadingPageModule } from '@shared/components/loading-page.module';


@NgModule({
  declarations: [
    ListarComponent,
    AgentesComponent,
    RegistarOuEditarComponent,
    AgentesSelecionadosComponent
  ],
  imports: [
    CommonModule,
    PassesProfissionalRoutingModule,
    ComponentsModule,
    FormsModule,
    NgSelect2Module,
    NgxPaginationModule,
    ReactiveFormsModule,
    LoadingPageModule
  ]
})
export class PassesProfissionalModule { }
