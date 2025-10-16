import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelect2Module } from 'ng-select2';
import { PerfilComponent } from './perfil.component';
import { PerfilRoutingModule } from './perfil-routing.module';
import { HistoricoProvimentoComponent } from './historico-provimento/historico-provimento.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DadosProfissionaisComponent } from './dados-profissionais/dados-profissionais.component';
import { MeiosDistribuidosComponent } from './meios-distribuidos/meios-distribuidos.component';
import { EventoComponent } from './evento/evento.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PortalAgenteComponent } from './portal-agente/portal-agente.component';
import { ProcessoIndividualComponent } from './processo-individual/processo-individual.component';
import { HistoricoFuncaoComponent } from './historico-funcao/historico-funcao.component';
import { ModalEditarFotoComponent } from './modal-editar-foto/modal-editar-foto.component';
import { ReclamacaoComponent } from './reclamacao/reclamacao.component';
import { DarTratamentoReclamacaoComponent } from './reclamacao/resources/dar-tratamento-reclamacao/dar-tratamento-reclamacao.component';
import { SolicitacaoComponent } from './solicitacao/solicitacao.component';
import { AprovacaoComponent } from './solicitacao/resources/aprovacao/aprovacao.component';
import { ModalTratamentoComponent } from './solicitacao/resources/modal-tratamento/modal-tratamento.component';
import { PendenteComponent } from './solicitacao/resources/pendente/pendente.component';
import { ReprovacaoComponent } from './solicitacao/resources/reprovacao/reprovacao.component';
import { TratamentoPdfComponent } from './tratamento-pdf/tratamento-pdf.component';
import { ArquivosComponent } from './arquivos/arquivos.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { RegistarOuEditarComponent } from './escala-trabalhos/registar-ou-editar/registar-ou-editar.component';
import { EscalaTrabalhosComponent } from './escala-trabalhos/escala-trabalhos.component';
import { SharedComponentsModule } from '@resources/modules/pa/shared/shared-components/shared-components.module';
import { EmTempoModule } from '../provimento/promocao/em-tempo/em-tempo.module';
import { HistoricoCargoComponent } from './historico-cargo/historico-cargo.component';
import { HistoricoMobilidadeComponent } from './historico-mobilidade/historico-mobilidade.component';
import { ComponentsModule } from '../../shared/components/components.module';
import { FaltasComponent } from './faltas/faltas.component';
import { LicencasComponent } from './licencas/licencas.component';
import { DadosClinicosComponent } from './dados-clinicos/dados-clinicos.component';
import { HistoricoEmpregoComponent } from './historico-empregos/historico-empregos.component';

@NgModule({
  declarations: [
    PerfilComponent,
    HistoricoEmpregoComponent,
    HistoricoProvimentoComponent,
    DadosProfissionaisComponent,
    MeiosDistribuidosComponent,
    EventoComponent,
    PortalAgenteComponent,
    ProcessoIndividualComponent,
    HistoricoFuncaoComponent,
    ModalEditarFotoComponent,
    ReclamacaoComponent,
    DarTratamentoReclamacaoComponent,
    SolicitacaoComponent,
    AprovacaoComponent,
    ModalTratamentoComponent,
    PendenteComponent,
    ReprovacaoComponent,
    TratamentoPdfComponent,
    ArquivosComponent,
    EscalaTrabalhosComponent,
    RegistarOuEditarComponent,
    HistoricoCargoComponent,
    HistoricoMobilidadeComponent,
  FaltasComponent,
  LicencasComponent,
  DadosClinicosComponent


  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    PerfilRoutingModule,
    NgxPaginationModule,
    FullCalendarModule,
    AngularEditorModule,
    SharedComponentsModule,
    EmTempoModule,
    ComponentsModule
  ]
})
export class PerfilModule { }
