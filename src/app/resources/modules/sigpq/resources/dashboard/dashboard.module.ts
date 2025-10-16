import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { LoadingPageModule } from '../../../../../shared/components/loading-page.module';
import { DashBoardSigpqRoutingModule } from './dashboard-routing.module';
import { BarraSuperiorDashboardComponent } from './barra-superior-dashboard/barra-superior-dashboard.component';
import { TelaAntigaComponent } from './tela-antiga/tela-antiga.component';
import { TelaPrincipalComponent } from './tela-principal/tela-principal.component';
import { EfectivoEspecialComponent } from './efectivo-especial/efectivo-especial.component';
import { EfectivoGeralComponent } from './efectivo-geral/efectivo-geral.component';
import { TelaEspecialComponent } from './tela-especial/tela-especial.component';
import { SpaceSeparatorPipe } from '../../core/pipes/spaceSeparatorPipe';
import { VoltarNaRotaAnteriorComponent } from './voltar-na-rota-anterior/voltar-na-rota-anterior.component';

@NgModule({
  imports: [
    CommonModule,
    LoadingPageModule,
    DashBoardSigpqRoutingModule,
  ],
  declarations: [VoltarNaRotaAnteriorComponent, SpaceSeparatorPipe,DashboardComponent,BarraSuperiorDashboardComponent,TelaAntigaComponent,TelaPrincipalComponent
    ,EfectivoEspecialComponent,EfectivoGeralComponent,TelaEspecialComponent
  ]
})
export class DashboardModule { }
