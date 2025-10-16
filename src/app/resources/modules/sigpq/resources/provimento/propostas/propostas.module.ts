import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropostasRoutingModule } from './propostas-routing.module';
import { ListarComponent } from './listar/listar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';
import { LoadingPageModule } from '@shared/components/loading-page.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@resources/modules/sigpq/shared/components/components.module';
import { AgentesPropostosComponent } from './agentes-propostos/agentes-propostos.component';
import { PdfPropostaComponent } from './pdf-proposta/pdf-proposta.component';
import { RegistarTratamentoComponent } from './agentes-propostos/registar-tratamento/registar-tratamento.component';
import { RemoverAgenteExceptoComponent } from '../remover-agente-excepto/remover-agente-excepto.component';



@NgModule({
  declarations: [
    ListarComponent,
    AgentesPropostosComponent,
    PdfPropostaComponent,
    RegistarTratamentoComponent,
   
    
  ],
  imports: [
    CommonModule,
    PropostasRoutingModule,
    NgxPaginationModule,
    NgSelect2Module,
    LoadingPageModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class PropostasModule { }
