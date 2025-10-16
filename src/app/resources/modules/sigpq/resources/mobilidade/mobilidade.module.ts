import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { MobilidadeRoutingModule } from './mobilidade-routing.module';

import { ListarComponent } from './listar/listar.component';
import { ListarAgentesComponent } from './listar-agentes/listar-agentes.component';
import { PdfMobilidadeComponent } from './pdf-mobilidade/pdf-mobilidade.component';
import { VerSelecionadosComponent } from './ver-selecionados/ver-selecionados.component';
import { ComponentsModule } from '../../shared/components/components.module';
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { VerAgentesMovidosComponent } from './ver-agentes-movidos/ver-agentes-movidos.component';
import { TratamentoSolicitacaoComponent } from '@resources/modules/pa/shared/shared-components/components/visualizar/tratamento-solicitacao/tratamento-solicitacao.component';
import { TratamentoMobilidadeModule } from './ver-agentes-movidos/tratamento-mobilidade/tratamento-mobilidade.module';
import { LoadingPageModule } from '@shared/components/loading-page.module';

@NgModule({
  declarations: [
    RegistarOuEditarComponent,
    ListarComponent,
    ListarAgentesComponent,
    VerSelecionadosComponent,
    PdfMobilidadeComponent,
    VerAgentesMovidosComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    MobilidadeRoutingModule,
    NgxPaginationModule,
    ComponentsModule,
    TratamentoMobilidadeModule,
    LoadingPageModule
  ]
})
export class MobilidadeModule { }
