import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarExpedientesComponent } from './listar-expedientes/listar-expedientes.component';
import { RegistarOuEditarExpedienteComponent } from './modal/registar-ou-editar-expediente/registar-ou-editar-expediente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedcomponentsModule } from '@resources/modules/sicgo/shared/components/sharedcomponents.module';
import { LoadingPageModule } from '@shared/components/loading-page.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { DelituosoRoutingModule } from '../delituoso/delituoso-routing.module';
import { ExpedientesViewComponent } from './expedientes-view/expedientes-view.component';
import { ExpedientesRoutingModule } from './expedientes-routing.module';
import { VisualisarOuImprimirComponent } from './modal/visualisar-ou-imprimir/visualisar-ou-imprimir.component';
import { AssociarSuspeitosComponent } from './modal/associar-suspeitos/associar-suspeitos.component';
import { ExpedientesComponent } from './expedientes.component';
import { EspandirDataComponent } from './modal/espandir-data/espandir-data.component';
import { RegistarOuEditarInfoInicialComponent } from './modal/registar-ou-editar-info-inicial/registar-ou-editar-info-inicial.component';
import { RegistarOuEditarPlanoDmedidasComponent } from './modal/registar-ou-editar-plano-dmedidas/registar-ou-editar-plano-dmedidas.component';
import { RegistarOuEditarSequenciaInformativaComponent } from './modal/registar-ou-editar-sequencia-informativa/registar-ou-editar-sequencia-informativa.component';
import { RegistarOuEditarAnexosComponent } from './modal/registar-ou-editar-anexos/registar-ou-editar-anexos.component';
import { UtilizadorModule } from '../acl/utilizador/utilizador.module';
import { RegistarOuEditarResumoAnaliticoComponent } from './modal/registar-ou-editar-resumo-analitico/registar-ou-editar-resumo-analitico.component';



@NgModule({
  declarations: [
    ListarExpedientesComponent,
    RegistarOuEditarExpedienteComponent,
    ExpedientesViewComponent,
    VisualisarOuImprimirComponent,
    AssociarSuspeitosComponent, 
    ExpedientesComponent, EspandirDataComponent, RegistarOuEditarInfoInicialComponent, RegistarOuEditarPlanoDmedidasComponent, RegistarOuEditarSequenciaInformativaComponent, RegistarOuEditarAnexosComponent, RegistarOuEditarResumoAnaliticoComponent,
    
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule, 
    NgSelect2Module,
    NgxPaginationModule,
    SharedcomponentsModule,
    LoadingPageModule,
    EditorModule,
    LoadingPageModule, 
    ExpedientesRoutingModule, 
    UtilizadorModule
  ],
  exports: [
      ListarExpedientesComponent
    ]
})
export class ExpedientesModule { }
