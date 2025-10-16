import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaSolicitacaoRoutingModule } from './pa-solicitacao-routing.module';
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { ListarComponent } from './listar/listar.component';
import { NgSelect2Module } from 'ng-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedComponentsModule } from '../../shared/shared-components/shared-components.module';
import { PendenteComponent } from './pendente/pendente.component';
import { HistoricoComponent } from './historico/historico.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { LicencasComponent } from './licencas/licencas.component';
import { LicencasModule } from '../../../sigpq/resources/licencas/licencas.module';
import { AgendarLicencaComponent } from './licencas/agendar-licenca/agendar-licenca.component';
import { GerarDocumentoPdfParaLicencaComponent } from './licencas/gerar-documentoPdf-para-licenca/gerar-documentoPdf-para-licenca.component';
import { FullCalendarModule } from '@fullcalendar/angular';


@NgModule({
  declarations: [
    RegistarOuEditarComponent,
    ListarComponent,
    PendenteComponent,
    HistoricoComponent,
    LicencasComponent,
    AgendarLicencaComponent,
    GerarDocumentoPdfParaLicencaComponent,
  ],
  imports: [
    CommonModule,
    PaSolicitacaoRoutingModule,
    NgSelect2Module,
    ReactiveFormsModule,
    NgxPaginationModule,
    SharedComponentsModule,
    FormsModule,
    AngularEditorModule,
    LicencasModule,
    FullCalendarModule
  ]
})
export class PaSolicitacaoModule { }
