import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@core/guards/auth.guard';

import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './resources/dashboard/dashboard.component';
import { MapComponent } from './shared/components/map/map.component';
import { MapPiqueteComponent } from './shared/components/map/map-piquete/map-piquete.component';
import { PiqueteComponent } from './resources/piquete/piquete.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // Dashboard
      {
        path: '',
        component: DashboardComponent,
        data: {
          breadcrumb: 'Painel de Controle',
          icon: 'speedometer2',
          parent: 'Painel de Controle e Gestão de Ocorrências',
          isHome: true,
        },
        loadChildren: () =>
          import('./resources/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },

      // Mapas
      {
        path: 'mapa',
        component: MapComponent,
        data: {
          breadcrumb: 'Mapa de Ocorrência',
          icon: 'map',
          parent: 'Ocorrências',
        },
      },
      {
        path: 'mapas',
        component: MapPiqueteComponent,
        data: {
          breadcrumb: 'Mapa de Ocorrência',
          icon: 'map',
          parent: 'Ocorrências',
        },
      },

      // Piquete
      {
        path: 'piquete',
        component: PiqueteComponent,
        data: {
          breadcrumb: 'Piquete',
          icon: 'bi-broadcast-pin',
          parent: 'Controlo e Gestão das Ocorrências',
        },
        loadChildren: () =>
          import('./resources/piquete/piquete.module').then((m) => m.PiqueteModule),
      },
      {
        path: 'piquete/relatorio',
        data: {
          breadcrumb: 'Relatórios',
          parent: 'Piquete',
        },
        loadChildren: () =>
          import('./resources/piquete/relatorios/relatorios.module').then((m) => m.RelatoriosModule),
      },

      // DINFOP
      {
        path: 'dinfop',
        data: {
          breadcrumb: 'Dinfop',
          icon: 'bi-broadcast-pin',
          parent: 'Direcção de Informações Policiais',
        },
        loadChildren: () =>
          import('./resources/dinfop-control/dinfop-control.module').then((m) => m.DinfopControlModule),
      },

      // DIIP
      {
        path: 'diip',
        data: {
          breadcrumb: 'DIIP',
          icon: 'bi-search',
          parent: 'Direcção de Investigação Criminal',
        },
        loadChildren: () =>
          import('./resources/diip/diip.module').then((m) => m.DiipModule),
      },

      // Configurações
      {
        path: 'config',
        data: {
          breadcrumb: 'Configurações',
          icon: 'gear',
        },
        loadChildren: () =>
          import('./resources/config/config.module').then((m) => m.ConfigModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SicgoRoutingModule {}
