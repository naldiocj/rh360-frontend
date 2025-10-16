import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2'; 
import { QRCodeModule } from 'angularx-qrcode';
import { SharedcomponentsModule } from '@resources/modules/sicgo/shared/components/sharedcomponents.module';
import { IntervenientesComponent } from './intervenientes.component';
import { IntervenienteRoutingModule } from './intervenientes-routing.module';
import { VitimaRoutingModule } from './vitima/vitima-routing.module';
import { IntervenientesPainelComponent } from './intervenientes-painel/intervenientes-painel.component';
import { AcusadoComponent } from './acusado/acusado.component';
import { CondutorComponent } from './condutor/condutor.component';
import { DenunciaAnonimaComponent } from './denuncia-anonima/denuncia-anonima.component';
import { DenunciaPublicaComponent } from './denuncia-publica/denuncia-publica.component';
import { DetidosComponent } from './detidos/detidos.component';
import { InformantesComponent } from './informantes/informantes.component';
import { LesadosComponent } from './lesados/lesados.component';
import { OficialOperativoComponent } from './oficial-operativo/oficial-operativo.component';
import { ParticipantesComponent } from './participantes/participantes.component';
import { SubinformantesComponent } from './subinformantes/subinformantes.component';
 
@NgModule({
  declarations: [
    IntervenientesComponent,
    IntervenientesPainelComponent,
    AcusadoComponent,
    CondutorComponent,
    DenunciaAnonimaComponent,
    DenunciaPublicaComponent,
    DetidosComponent,
    InformantesComponent,
    LesadosComponent,
    OficialOperativoComponent,
    ParticipantesComponent,
    SubinformantesComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    IntervenienteRoutingModule,
    VitimaRoutingModule,
    NgxPaginationModule,
    QRCodeModule,
    NgSelect2Module,
    SharedcomponentsModule
   ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class IntervenienteModule { }
