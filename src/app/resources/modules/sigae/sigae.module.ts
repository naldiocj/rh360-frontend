import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigaeComponent } from './sigae.component';
import { SigaeRoutingModule } from './sigea-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './resources/dashboard/dashboard.component';
import { NgxEditorModule } from 'ngx-editor';

import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NgSelect2Module } from 'ng-select2';
import { HeaderComponent } from './layout/header/header.component';
import { MunicoesComponent } from './resources/municoes/municoes.component';
import { ExplosivosComponent } from './resources/explosivos/explosivos.component';
import { ArmasRecolhaComponent } from './resources/armas-recolha/armas-recolha.component';
import { ArmasOrganicasComponent } from './resources/armas-organicas/armas-organicas.component';
import { ArmasEstraviadasComponent } from './resources/armas-estraviadas/armas-estraviadas.component';
import { ArmasEntradaComponent } from './resources/armas-entrada/armas-entrada.component';
import { ArmasEmpresaComponent } from './resources/armas-empresa/armas-empresa.component';
import { ArmasCrimeComponent } from './resources/armas-crime/armas-crime.component';
import { RelatoriosGeradosComponent } from './resources/relatorios-gerados/relatorios-gerados.component';
import { RelatoriosGerarComponent } from './resources/relatorios-gerar/relatorios-gerar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ArmasLotesComponent } from './resources/armas-lotes/armas-lotes.component';
import { ExplosivosLotesComponent } from './resources/explosivos-lotes/explosivos-lotes.component';
import { DirecaoComponent } from './resources/direcao/direcao.component';
import { SolicitacoesComponent } from './resources/solicitacoes/solicitacoes.component';
import { LotesMunicoesComponent } from './resources/lotes-municoes/lotes-municoes.component';

import { ModaisComponent } from './resources/modais/modais.component';
import { PedentesComponent } from './resources/solicitacoes/pedentes/pedentes.component';
import { HistoricoComponent } from './resources/solicitacoes/historico/historico.component';
import { SolicitacoesDirecoesComponent } from './resources/solicitacoes-direcoes/solicitacoes-direcoes.component';
import { SolicitacoesDirecoesPendentesComponent } from './resources/solicitacoes-direcoes/solicitacoes-direcoes-pendentes/solicitacoes-direcoes-pendentes.component';
import { SolicitacoesDirecoesHistoricosComponent } from './resources/solicitacoes-direcoes/solicitacoes-direcoes-historicos/solicitacoes-direcoes-historicos.component';
import { RegistarUsuarioComponent } from './resources/registar-usuario/registar-usuario.component';
import { LiistarUsuarioComponent } from './resources/liistar-usuario/liistar-usuario.component';
import { EntregadasComponent } from './resources/entregadas/entregadas.component';
import { EntidadesComponent } from './resources/config/entidades/entidades.component';
import { AtribuirComponent } from './resources/gestao/atribuir/atribuir.component';
import { DistribuicaoComponent } from './resources/gestao/distribuicao/distribuicao.component';
import { CuringaComponent } from './resources/curinga/curinga.component';
import { ListarMunicaoComponent } from './resources/Lotes/listar-municao/listar-municao.component';
import { ListarExplosivosComponent } from './resources/Lotes/listar-explosivos/listar-explosivos.component';
import { ListarArmasComponent } from './resources/Lotes/listar-armas/listar-armas.component';
import { ArmasDesportivasComponent } from './resources/armas-desportivas/armas-desportivas.component';
import { ArmasSegurancaPessualComponent } from './resources/armas-seguranca-pessual/armas-seguranca-pessual.component';
import { ArmasCacaComponent } from './resources/armas-caca/armas-caca.component';
import { ArmasConvenioComponent } from './resources/armas-convenio/armas-convenio.component';
import { ArmaRespostaComponent } from './resources/arma-resposta/arma-resposta.component';
import { ListarGerarComponent } from './resources/relatorios-gerar/listar-gerar/listar-gerar.component';
import { CardDashboardComponent } from './resources/card-dashboard/card-dashboard.component';
import { RegisterComponent } from './resources/quartelamento/register/register.component';
import { ListarComponent } from './resources/quartelamento/listar/listar.component';
import { AtribuidosComponent } from './resources/quartelamento/atribuidos/atribuidos.component';
import { MaterialModule } from './resources/config/material/material.module';
import { LoadingPageModule } from '@shared/components/loading-page.module';
import { DashboardMaterialComponent } from './resources/dashboard-material/dashboard.component';
import { CrimesComponent } from './resources/quartelamento/crimes/crimes.component';
import { ExtraviadosComponent } from './resources/quartelamento/extraviados/extraviados.component';
import { ExpolhosComponent } from './resources/quartelamento/expolhos/expolhos.component';

@NgModule({
  imports: [
    CommonModule,
    SigaeRoutingModule,
    NgSelect2Module,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    AngularEditorModule,
    NgxEditorModule.forRoot({
      locals: {
        // menu
        bold: 'Bold',
        italic: 'Italic',
        code: 'Code',
        underline: 'Underline',
        strike: 'Strike',
        blockquote: 'Blockquote',
        bullet_list: 'Bullet List',
        ordered_list: 'Ordered List',
        heading: 'Heading',
        h1: 'Header 1',
        h2: 'Header 2',
        h3: 'Header 3',
        h4: 'Header 4',
        h5: 'Header 5',
        h6: 'Header 6',
        align_left: 'Left Align',
        align_center: 'Center Align',
        align_right: 'Right Align',
        align_justify: 'Justify',
        text_color: 'Text Color',
        background_color: 'Background Color',
        insertLink: 'Insert Link',
        removeLink: 'Remove Link',
        insertImage: 'Insert Image',
        // pupups, forms, others...
        url: 'URL',
        text: 'Text',
        openInNewTab: 'Open in new tab',
        insert: 'Insert',
        altText: 'Alt Text',
        title: 'Title',
        remove: 'Remove',
      },
    }),
  ],
  declarations: [
    SigaeComponent,
    LayoutComponent,
    DashboardComponent,
    DashboardMaterialComponent,
    SidebarComponent,
    HeaderComponent,
    MunicoesComponent,
    ExplosivosComponent,
    ArmasRecolhaComponent,
    ArmasOrganicasComponent,
    ArmasEstraviadasComponent,
    ArmasEntradaComponent,
    ArmasEmpresaComponent,
    ArmasCrimeComponent,
    RelatoriosGeradosComponent,
    RelatoriosGerarComponent,
    ArmasLotesComponent,
    ExplosivosLotesComponent,
    DirecaoComponent,
    SolicitacoesComponent,
    LotesMunicoesComponent,
    ModaisComponent,
    PedentesComponent,
    HistoricoComponent,
    SolicitacoesDirecoesComponent,
    SolicitacoesDirecoesPendentesComponent,
    SolicitacoesDirecoesHistoricosComponent,
    RegistarUsuarioComponent,
    LiistarUsuarioComponent,
    EntregadasComponent,
    EntidadesComponent,
    AtribuirComponent,
    DistribuicaoComponent,
    CuringaComponent,
    ListarMunicaoComponent,
    ListarExplosivosComponent,
    ListarArmasComponent,
    ArmasDesportivasComponent,
    ArmasSegurancaPessualComponent,
    ArmasCacaComponent,
    ArmasConvenioComponent,
    ArmaRespostaComponent,
    ListarGerarComponent,
    CardDashboardComponent,
    RegisterComponent,
    ListarComponent,
    AtribuidosComponent,
    CrimesComponent,
    ExtraviadosComponent,
    ExpolhosComponent
  ],
  exports: [NgxEditorModule, CardDashboardComponent],
})
export class SigaeModule {}
