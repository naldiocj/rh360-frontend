import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { SolicitacaoEnviadaComponent } from './components/solicitacao-enviada/solicitacao-enviada.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { EscTrabalhoComponent } from './components/visualizar/esc-trabalho/esc-trabalho.component';
import { FolhaPdfComponent } from './components/folha-pdf/folha-pdf.component';
import { SolicitacaoComponent } from './components/visualizar/solicitacao/solicitacao.component';
import { TratamentoSolicitacaoComponent } from './components/visualizar/tratamento-solicitacao/tratamento-solicitacao.component';
import { ViewPdfComponent } from './components/visualizar/view-pdf/view-pdf.component';
import { ZoomFotoComponent } from './zoom-foto/zoom-foto.component';
import { FichaCompletaComponent } from './components/fichas/ficha-completa/ficha-completa.component';
import { CameraComponent } from './components/camera/camera.component';
import { NgSelect2Module } from 'ng-select2';
import { FichaAgenteComponent } from './components/ficha-agente/ficha-agente.component';
import { CvAgenteComponent } from './components/cv-agente/cv-agente.component';
import { LoadingPageModule } from '@shared/components/loading-page.module';
import { ExtratoAgenteComponent } from './components/extrato-agente/extrato-agente.component';
import { ExtratoAgenteNovoComponent } from './components/extrato-agente-novo/extrato-agente-novo.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';





@NgModule({
  declarations: [
    CardComponent,
    SolicitacaoEnviadaComponent,
    EscTrabalhoComponent,
    FolhaPdfComponent,
    SolicitacaoComponent,
    TratamentoSolicitacaoComponent,
    ViewPdfComponent,
    ZoomFotoComponent,
    FichaAgenteComponent,
    FichaCompletaComponent,
    CameraComponent,
    CvAgenteComponent,
    ExtratoAgenteComponent,
    ExtratoAgenteNovoComponent,
    MenuItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgSelect2Module,
    LoadingPageModule
  ]
  , exports: [
    CardComponent,
    SolicitacaoEnviadaComponent,
    EscTrabalhoComponent,
    FolhaPdfComponent,
    SolicitacaoComponent,
    TratamentoSolicitacaoComponent,
    ViewPdfComponent,
    ZoomFotoComponent,
    CameraComponent,
    FichaAgenteComponent,
    ExtratoAgenteComponent,
    ExtratoAgenteNovoComponent
  ]
})
export class SharedComponentsModule { }
