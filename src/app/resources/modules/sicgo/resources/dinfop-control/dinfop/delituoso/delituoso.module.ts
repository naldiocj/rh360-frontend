import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DelituosoRoutingModule } from './delituoso-routing.module';

import { NgxPaginationModule } from 'ngx-pagination';

// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { ListarComponent } from "./listar/listar.component"
import { RegistarOuEditarComponent } from './registar/registar-ou-editar/registar-ou-editar.component';
import { RegistoFacialComponent } from './modal/registo-facial/registo-facial.component';
import { RegistoBiometricoComponent } from './modal/registo-biometrico/registo-biometrico.component';
import { SharedcomponentsModule } from '@resources/modules/sicgo/shared/components/sharedcomponents.module';
import { DelituosoViewComponent } from './delituoso-view/delituoso-view.component';
import { AssociarDelituososComponent } from './modal/associacao-criminosa/associar-delituosos/associar-delituosos.component';
import { VerDelituososComponent } from './modal/associacao-criminosa/associar-delituosos/ver-delituosos/ver-delituosos.component';
import { MaosBiometricoComponent } from './modal/maos-biometrico/maos-biometrico.component';
import { RegistoAntecedenteComponent } from './modal/registo-antecedente/registo-antecedente.component';
import { RegistoAssociarGrupoComponent } from './modal/registo-associar-grupo/registo-associar-grupo.component';
import { RegistoDecisaoTribunalComponent } from './modal/registo-decisao-tribunal/registo-decisao-tribunal.component';
import { RegistoOrigemComponent } from './modal/registo-origem/registo-origem.component';
import { RegistoSituacaoCondenadoComponent } from './modal/registo-situacao-condenado/registo-situacao-condenado.component';
import { RegistoModoOperanteComponent } from './modal/registo-modo-operante/registo-modo-operante.component';
import { LoadingPageModule } from '@shared/components/loading-page.module';
import { VerSelecionadosComponent } from './modal/ver-selecionados/ver-selecionados.component';
import { DinfopFichaDelituosoComponent } from './modal/dinfop-ficha-delituoso/dinfop-ficha-delituoso.component';
import { BuscaDelituosoBiComponent } from './buscas/busca-delituoso-bi/busca-delituoso-bi.component';
import { BuscaDelituosoVozComponent } from './buscas/busca-delituoso-voz/busca-delituoso-voz.component';
import { BuscaFacialDelituosoComponent } from './buscas/busca-facial-delituoso/busca-facial-delituoso.component';
import { DelituosoDetalhesComponent } from './delituoso-detalhes/delituoso-detalhes.component';
import { RegistarOuEditarProcuradosComponent } from './modal/registar-ou-editar-procurados/registar-ou-editar-procurados.component';
import { ListaModoOperanteComponent } from './modal/registo-modo-operante/lista-modo-operante/lista-modo-operante.component';
import { ListaAntecedenteComponent } from './modal/registo-antecedente/lista/lista-antecedente/lista-antecedente.component';
import { ListaAntecedenteOcorrenciaComponent } from './modal/registo-antecedente/lista/lista-antecedente-ocorrencia/lista-antecedente-ocorrencia.component';
import { RegistoOuEditarTratamentoComponent } from './modal/registo-ou-editar-tratamento/registo-ou-editar-tratamento.component';
import { ListaOrigemComponent } from './modal/registo-origem/lista-origem/lista-origem.component';
import { RegistarOuEditarArquivosComponent } from './modal/registar-ou-editar-arquivos/registar-ou-editar-arquivos.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { PiqueteModule } from '../../../piquete/piquete.module';
import { RegistarOuEditarMotivoSuspeitaComponent } from './modal/registar-ou-editar-motivo-suspeita/registar-ou-editar-motivo-suspeita.component';
import { ExpedientesModule } from '../expedientes/expedientes.module';
import { AssociarExpedienteComponent } from './modal/associar-expediente/associar-expediente.component';
import { TypewriterComponent } from './delituoso-view/typewriter/typewriter.component';
import { IdentificadorComponent } from './buscas/identificador/identificador.component';
import { MasculinoComponent } from './registar/avatar/masculino/masculino.component';
import { FemeninoComponent } from './registar/avatar/femenino/femenino.component';
import { AvatarFormComponent } from './registar/avatar/avatar-form/avatar-form.component';
import { BuscaBiometricaComponent } from './buscas/busca-biometrica/busca-biometrica.component';
 

@NgModule({
  declarations: [
    RegistarOuEditarComponent,
    ListarComponent,
    RegistoFacialComponent,
    RegistoBiometricoComponent,
    RegistoSituacaoCondenadoComponent,
    RegistoDecisaoTribunalComponent,
    DelituosoViewComponent,
    RegistoOrigemComponent,
    RegistoAssociarGrupoComponent,
    RegistoAntecedenteComponent,
    AssociarDelituososComponent,
    VerDelituososComponent,
    MaosBiometricoComponent,
    RegistoModoOperanteComponent,
    VerSelecionadosComponent,
    DinfopFichaDelituosoComponent,
    BuscaDelituosoBiComponent,  
    BuscaDelituosoVozComponent, 
    BuscaFacialDelituosoComponent, 
    DelituosoDetalhesComponent, 
    RegistarOuEditarProcuradosComponent, 
    ListaModoOperanteComponent, 
    ListaAntecedenteComponent, 
    ListaAntecedenteOcorrenciaComponent, 
    RegistoOuEditarTratamentoComponent, 
    ListaOrigemComponent, 
    RegistarOuEditarArquivosComponent, 
    RegistarOuEditarMotivoSuspeitaComponent, AssociarExpedienteComponent, TypewriterComponent, IdentificadorComponent, MasculinoComponent, FemeninoComponent, AvatarFormComponent, BuscaBiometricaComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DelituosoRoutingModule,
    NgSelect2Module,
    NgxPaginationModule,
    SharedcomponentsModule,
    LoadingPageModule,
    EditorModule,
    ExpedientesModule
  ],
  exports: [
    ListarComponent,
    RegistoOrigemComponent,
    DelituosoViewComponent,
  ]
})
export class DelituosoModule { }
