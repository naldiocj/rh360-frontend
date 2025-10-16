import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SigpqRoutingModule } from './sigpq-routing.module';

import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { DefinicoesComponent } from './layout/header/definicoes/definicoes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RelatorioGeralRoutingModule } from './resources/relatorio/relatorio-geral-routing.module';
import { SigpqTelaModule } from './resources/sigpq-tela/sigpq-tela.module';
import { LoadingPageModule } from '@shared/components/loading-page.module';
import { CargoEChefiaComponent } from './resources/estatistica/mapa-geral/cargo-direccao-chefia/cargo-e-chefia/cargo-e-chefia.component';
import { FormacaoAcademicaComponent } from './resources/estatistica/mapa-geral/cargo-direccao-chefia/formacao-academica/formacao-academica.component';
import { ComposicaoEtariaComponent } from './resources/estatistica/mapa-geral/cargo-direccao-chefia/composicao-etaria/composicao-etaria.component';
import { DistribuicaoPorOrgaoComponent } from './resources/estatistica/mapa-geral/cargo-direccao-chefia/distribuicao-por-orgao/distribuicao-por-orgao.component';
import { MapaDaEfetividadeComponent } from './resources/estatistica/mapa-geral/mapas-de-efetividades/mapa-da-efetividade/mapa-da-efetividade.component';
import { MapaPassividadeComponent } from './resources/estatistica/mapa-geral/mapas-de-efetividades/mapa-passividade/mapa-passividade.component';
import { MapaNivelAcademicoComponent } from './resources/estatistica/mapa-geral/mapas-de-efetividades/mapa-nivel-academico/mapa-nivel-academico.component';
import { NgSelect2Module } from 'ng-select2';
import { CargoDireccaoChefiaComponent } from './resources/estatistica/mapa-geral/cargo-direccao-chefia/cargo-direccao-chefia.component';
import { MapasDeEfetividadesComponent } from './resources/estatistica/mapa-geral/mapas-de-efetividades/mapas-de-efetividades.component';
import { MapaGeralComponent } from './resources/estatistica/mapa-geral/mapa-geral.component';

@NgModule({
  declarations: [
    SidebarComponent,
    LayoutComponent,
    HeaderComponent,
    DefinicoesComponent,
    CargoEChefiaComponent,
    CargoDireccaoChefiaComponent,
    FormacaoAcademicaComponent,
    ComposicaoEtariaComponent,
    DistribuicaoPorOrgaoComponent,
    MapaDaEfetividadeComponent,
    MapasDeEfetividadesComponent,
    MapaPassividadeComponent,
    MapaNivelAcademicoComponent,
    MapaGeralComponent,


  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SigpqRoutingModule,
    RelatorioGeralRoutingModule,
    SigpqTelaModule,
    LoadingPageModule,
    NgSelect2Module
  ]
})
export class SigpqModule { }
