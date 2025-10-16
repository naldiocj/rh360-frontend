import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { PaRoutingModule } from './pa-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { DashboardComponent } from './resources/dashboard/dashboard.component';
import { PerfilComponent } from './resources/perfil/perfil.component';
import { DadosComponent } from './resources/dados/dados.component';
import { PessoalComponent } from './resources/dados/pessoal/pessoal.component';
import { ProfissionalComponent } from './resources/dados/profissional/profissional.component';
import { ArquivoComponent } from './resources/arquivo/arquivo.component';
import { ArquivosComponent } from './resources/arquivo/arquivos/arquivos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PushComponent } from './resources/push/push.component';
import { HistoricoProvimentoComponent } from './resources/dados/historico-provimento/historico-provimento.component';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { MeiosDistribuidosComponent } from './resources/dados/meios-distribuidos/meios-distribuidos.component';
import { DadosProfissionaisComponent } from './resources/dados/dados-profissionais/dados-profissionais.component';
import { SharedComponentsModule } from './shared/shared-components/shared-components.module';


@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    PerfilComponent,
    DadosComponent,
    PessoalComponent,
    ProfissionalComponent,
    ArquivoComponent,
    ArquivosComponent,
    PushComponent,
    // PersonalComponent,
    // DataProfissionalComponent,
    HistoricoProvimentoComponent,
    MeiosDistribuidosComponent,
    DadosProfissionaisComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    NgxPaginationModule,
    PaRoutingModule,
    // NgApexchartsModule,
    ReactiveFormsModule,
    SharedComponentsModule
    // NgxPrintModule

  ]
})
export class PaModule { }
