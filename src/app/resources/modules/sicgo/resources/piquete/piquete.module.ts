import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { ListarOcorrenciaComponent } from './listar/listar.component';
import { PiqueteViewComponent } from './piquete-view/piquete-view.component';
import { FormulariosComponent } from './formularios/formularios.component';
import { PiqueteComponent } from './piquete.component';
import { TestemunhaComponent } from './modals/testemunha/testemunha.component';
import { EvidenciaComponent } from './modals/evidencia/evidencia.component';
import { VitimaModalComponent } from './modals/vitima-modal/vitima-modal.component';
import { LinkarSuspeitoModalComponent } from './modals/linkar-suspeito-modal/linkar-suspeito-modal.component';
import { ArquivoMidiaComponent } from './modals/arquivo-midia/arquivo-midia.component';
import { ListarTestemunhaComponent } from './modals/testemunha/listar-testemunha/listar-testemunha.component';
import { ListarLinkarSuspeitoComponent } from './modals/linkar-suspeito-modal/listar-linkar-suspeito/listar-linkar-suspeito.component';
import { ListarEvidenciaComponent } from './modals/evidencia/listar-evidencia/listar-evidencia.component';
import { EvidenciaPropriedadeComponent } from './modals/evidencia/evidencia-propriedade/evidencia-propriedade.component';
import { EvidenciaHistoricoComponent } from './modals/evidencia/evidencia-historico/evidencia-historico.component';
import { PiqueteRoutingModule } from './piquete-routing.module';
import { TipodebensComponent } from './modals/tipodebens/tipodebens.component';
import { ListarTipodebensComponent } from './modals/tipodebens/listar-tipodebens/listar-tipodebens.component';
import { TipodebensPropriedadeComponent } from './modals/tipodebens/tipodebens-propriedade/tipodebens-propriedade.component';
import { TipodebensHistoricoComponent } from './modals/tipodebens/tipodebens-historico/tipodebens-historico.component';
import { QRCodeModule } from 'angularx-qrcode';
import { SharedcomponentsModule } from '../../shared/components/sharedcomponents.module';
import { RegistarOuEditarComponent } from './registo-de-ocorrencias/registar-ou-editar/registar-ou-editar.component';
import { RegistarOuEditarVeiculoComponent } from './modals/veiculo/registar-ou-editar-veiculo/registar-ou-editar-veiculo.component';
import { ListarVeiculoComponent } from './modals/veiculo/listar-veiculo/listar-veiculo.component';
import { VitimaListaComponent } from './modals/vitima-modal/vitima-lista/vitima-lista.component';
import { VerSelecionadosComponent } from './modals/linkar-suspeito-modal/ver-selecionados/ver-selecionados.component';
import { GrupoListaComponent } from './modals/grupo/grupo-lista/grupo-lista.component';
import { AssociarGrupoRegistoOuEditarComponent } from './modals/grupo/associar-grupo-registo-ou-editar/associar-grupo-registo-ou-editar.component';
import { OcorrenciasSelecionadosComponent } from './registo-de-ocorrencias/ocorrencias-selecionados/ocorrencias-selecionados.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormularioTransitoComponentComponent } from './registo-de-ocorrencias/formulario-transito-component/formulario-transito-component.component';
import { FormularioOrdemPublicaComponent } from './registo-de-ocorrencias/formulario-ordem-publica/formulario-ordem-publica.component';
import { PesquisarOcorrenciasPipe } from '../../shared/Pipe/pesquisar_ocorrencias/pesquisar-ocorrencias.pipe';
import { PiqueteMapComponent } from './piquete-map/piquete-map.component';
import { RegistarOuEditarArmaComponent } from './modals/armas/registar-ou-editar/registar-ou-editar.component';
 
@NgModule({
  declarations: [
    RegistarOuEditarComponent,
    ListarOcorrenciaComponent, 
    PiqueteViewComponent,
    FormulariosComponent,
    PiqueteComponent,
    TestemunhaComponent,
    ListarTestemunhaComponent,
    EvidenciaComponent,
    VitimaModalComponent,
    LinkarSuspeitoModalComponent,
    ArquivoMidiaComponent,
    ListarLinkarSuspeitoComponent,
    ListarEvidenciaComponent,
    EvidenciaPropriedadeComponent,
    EvidenciaHistoricoComponent,
    TipodebensComponent,
    ListarTipodebensComponent,
    TipodebensPropriedadeComponent,
    TipodebensHistoricoComponent,
    RegistarOuEditarVeiculoComponent,
    ListarVeiculoComponent,
    VitimaListaComponent,
    VerSelecionadosComponent,
    GrupoListaComponent,
    AssociarGrupoRegistoOuEditarComponent,
    OcorrenciasSelecionadosComponent,
    FormularioTransitoComponentComponent,
    FormularioOrdemPublicaComponent,
    PesquisarOcorrenciasPipe,
    RegistarOuEditarArmaComponent,
    PiqueteMapComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    PiqueteRoutingModule,
    NgxPaginationModule,
    QRCodeModule,
    NgSelect2Module,
    SharedcomponentsModule,
    EditorModule
   ],
   exports: [ListarOcorrenciaComponent,PiqueteViewComponent], // Exporta o componente
   schemas: [NO_ERRORS_SCHEMA],
})
export class PiqueteModule { }
