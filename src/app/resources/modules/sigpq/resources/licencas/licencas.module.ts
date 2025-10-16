import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingPageModule } from '@shared/components/loading-page.module';
import { LicencasRoutingModule } from './licencas-routing.module';
import { FuncionarioModule } from '../funcionario/funcionario.module';
import { ComponentsModule } from '@resources/modules/sigpq/shared/components/components.module';
import { PlanificarLicencaComponent } from './planificar-licenca/planificar-licenca.component';
import { AgendarLicencaComponent } from './agendar-licenca/agendar-licenca.component';
import { AnalisarLicencaComponent } from './analisar-licenca/analisar-licenca.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { GerarDocumentoPdfParaLicencaComponent } from './gerar-documentoPdf-para-licenca/gerar-documentoPdf-para-licenca.component';
import { DraggableDirective } from '../../shared/directiva/Draggable.directive';
@NgModule({
  declarations: [
    PlanificarLicencaComponent,
    AgendarLicencaComponent,
    GerarDocumentoPdfParaLicencaComponent,
    AnalisarLicencaComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FullCalendarModule,
    ReactiveFormsModule,
    NgSelect2Module,
    NgxPaginationModule,
    LoadingPageModule,
    LicencasRoutingModule,
    FuncionarioModule,
    ComponentsModule,
    DraggableDirective
  ],
  exports:[
    AgendarLicencaComponent,
    PlanificarLicencaComponent,
    GerarDocumentoPdfParaLicencaComponent
  ]
})
export class LicencasModule { }
