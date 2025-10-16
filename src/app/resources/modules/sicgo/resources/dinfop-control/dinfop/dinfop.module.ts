
import { DinfopRoutingModule } from './dinfop-routing.module';
import { DinfopComponent } from './dinfop.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedcomponentsModule } from '@resources/modules/sicgo/shared/components/sharedcomponents.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { OcorrenciasComponent } from './ocorrencias/ocorrencias.component';
import { PiqueteModule } from '../../piquete/piquete.module';
import { BuscarDelituosoComponent } from './delituoso/buscar-delituoso/buscar-delituoso.component';
import { NotificacoesComponent } from './notificacoes/notificacoes/notificacoes.component';

@NgModule({
  declarations: [
    DinfopComponent,
    OcorrenciasComponent, 
    BuscarDelituosoComponent, NotificacoesComponent
  ],
  imports: [
    CommonModule,
    DinfopRoutingModule,
    SharedcomponentsModule,
    NgxPaginationModule,
    EditorModule,
    PiqueteModule
  ]
})
export class DinfopModule { }
