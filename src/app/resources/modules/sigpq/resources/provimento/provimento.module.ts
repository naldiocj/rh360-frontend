import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProvimentoRoutingModule } from './provimento-routing.module';
import { LoadingPageModule } from '@shared/components/loading-page.module';
import { ListarComponent } from './listar/listar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '../../shared/components/components.module';
import { AgentePorOrdemComponent } from './agente-por-ordem/agente-por-ordem.component';


@NgModule({
  declarations: [
    ListarComponent,
    AgentePorOrdemComponent,
  ],
  imports: [
    CommonModule,
    ProvimentoRoutingModule,
    LoadingPageModule,
    NgxPaginationModule,
    NgSelect2Module,
    FormsModule,
    LoadingPageModule,
    ComponentsModule,
  ],
})
export class ProvimentoModule {}
