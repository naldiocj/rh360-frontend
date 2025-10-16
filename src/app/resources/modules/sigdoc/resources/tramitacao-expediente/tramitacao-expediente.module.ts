import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarComponent } from './listar/listar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';
import { ComponentsModule } from '@resources/modules/sigpq/shared/components/components.module';
import { HttpClientModule } from '@angular/common/http';
import { TramitacaoExpedienteRoutingModule } from './tramitacao-expediente-routing.module';
import { ExpedienteRecebidoComponent } from './expediente-recebido/expediente-recebido.component';
import { TramitarDocumentoComponent } from './tramitar-documento/tramitar-documento.component';
import { ExpedienteTramitadoComponent } from './expediente-tramitado/expediente-tramitado.component';
import { TramitarDocumentoEditarComponent } from './tramitar-documento-editar/tramitar-documento-editar.component';
import { DetalheOuHistoricoComponent } from './detalhe-ou-historico/detalhe-ou-historico.component';
import { LoadingPageModule } from '@shared/components/loading-page.module';

@NgModule({
  declarations: [
    ListarComponent,
    ExpedienteRecebidoComponent,
    TramitarDocumentoComponent,
    ExpedienteTramitadoComponent,
    TramitarDocumentoEditarComponent,
    DetalheOuHistoricoComponent,
  ],
  exports: [
    ExpedienteRecebidoComponent,
    TramitarDocumentoComponent,
    ExpedienteTramitadoComponent,
    TramitarDocumentoEditarComponent
  ],
  imports: [
    CommonModule,
    TramitacaoExpedienteRoutingModule,
    FormsModule,
    NgxPaginationModule,
    NgSelect2Module,
    ReactiveFormsModule,
    ComponentsModule,
    HttpClientModule,
    LoadingPageModule,
  ]
})
export class TramitacaoExpedienteModule { }
