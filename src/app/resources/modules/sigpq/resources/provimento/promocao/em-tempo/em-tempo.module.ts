import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';

import { EmTempoRoutingModule } from './em-tempo-routing.module';

import { ListarComponent } from './listar/listar.component';
import { PromoverModalComponent } from './promover-modal/promover-modal.component';
import { ComponentsModule } from '@resources/modules/sigpq/shared/components/components.module';
import { VerSelecionadosComponent } from './ver-selecionados/ver-selecionados.component';
import { LoadingPageModule } from '@shared/components/loading-page.module';
import { RemoverAgenteExceptoComponent } from '../../remover-agente-excepto/remover-agente-excepto.component';


@NgModule({
  declarations: [
    ListarComponent,
    PromoverModalComponent,
    VerSelecionadosComponent
  ],
  // exports: [RegistarOuEditarModalComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    EmTempoRoutingModule,
    NgSelect2Module,
    ComponentsModule,
    LoadingPageModule,
    RemoverAgenteExceptoComponent
  ], exports: [
    PromoverModalComponent
  ]
})
export class EmTempoModule { }
