import { NgModel } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from '@core/guards/auth.guard';
import { DashboardComponent } from './resources/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'SIGEF',
    },

    children: [
      {
        canActivate: [AuthGuard],
        path: 'dashboard',
        data: {
          breadcrum: 'Dashboard',
        },
        component: DashboardComponent,
      },

      {
        canActivate: [AuthGuard],
        path: 'utilizadores',
        data: {
          breadcrumb: 'utilizadores',
        },
        loadChildren: () =>
          import('./resources/utilizadores/utilizadores.module').then(
            (m) => m.UtilizadoresModule
          ),
      },

      {
        canActivate: [AuthGuard],
        path: 'funcoes',
        data: {
          breadcrumb: 'funcoes',
        },
        loadChildren: () =>
          import('./resources/funcoes/funcoes.module').then(
            (m) => m.FuncoesModule
          ),
      },

      {
        canActivate: [AuthGuard],
        path: 'formadores',
        data: {
          breadcrumb: 'formadores',
        },
        loadChildren: () =>
          import('./resources/formadores/formadores.module').then(
            (m) => m.FormadoresModule
          ),
      },

      {
        canActivate: [AuthGuard],
        path: 'cursos',
        data: {
          breadcrumb: 'mapa-cursos',
        },
        loadChildren: () =>
          import('./resources/mapa-de-cursos/mapa-de-cursos.module').then(
            (m) => m.MapaDeCursosModule
          ),
      },

      {
        canActivate: [AuthGuard],
        path: 'plano-Mapa-cursos',
        data: {
          breadcrumb: 'plano-de-MapaDe_cursos',
        },
        loadChildren: () =>
          import(
            './resources/plano-de-MapaDe_cursos/planoDeMapaDeCursos.module'
          ).then((m) => m.PladoDeMapaDeCursosModule),
      },

      {
        canActivate: [AuthGuard],
        path: 'instituicoes',
        data: {
          breadcrumb: 'instituicao-de-ensino',
        },
        loadChildren: () =>
          import(
            './resources/instituicao-de-ensino/instituicao-de-ensino.module'
          ).then((m) => m.IstituicaoDeEnsinoModule),
      },

      {
        canActivate: [AuthGuard],
        path: 'proveniencia',
        data: {
          breadcrumb: 'proveniencia',
        },
        loadChildren: () =>
          import('./resources/proveniencia/proveniencia.module').then(
            (m) => m.ProvenienciaRoutingModule
          ),
      },

      {
        canActivate: [AuthGuard],
        path: 'regimeEspecial',
        data: {
          breadcrumb: 'regime-especial',
        },
        loadChildren: () =>
          import(
            './resources/regime-especial/regime-especial-personalizado.module'
          ).then((m) => m.RegimeEspecialModule),
      },

      {
        canActivate: [AuthGuard],
        path: 'regimeGeral',
        data: {
          breadcrumb: 'regime-geral',
        },
        loadChildren: () =>
          import(
            './resources/regime-geral/regime-geral-personalizado.module'
          ).then((m) => m.RegimeGeralModule),
      },

      {
        canActivate: [AuthGuard],
        path: 'relatorios-padronizados',
        data: {
          breadcrumb: 'relatorios-padronizados',
        },
        loadChildren: () =>
          import(
            './resources/relatorios-padronizados/relatorios-padronizados.module'
          ).then((m) => m.RelatoriosPadronizadosModule),
      },

      {
        canActivate: [AuthGuard],
        path: 'avaliacoes',
        data: {
          breadcrumb: 'avaliacoes',
        },
        loadChildren: () =>
          import('./resources/avaliacoes/avaliacoes.module').then(
            (m) => m.AvaliacoesRoutingModule
          ),
      },

      {
        canActivate: [AuthGuard],
        path: 'configuracoes',
        data: {
          breadcrumb: 'configuracoes',
        },
        loadChildren: () =>
          import('./resources/configuracoes/configuracoes.module').then(
            (m) => m.ConfiguracoesModule
          ),
      },

      {
        canActivate: [AuthGuard],
        path: 'instruendos',
        data: {
          breadcrumb: 'instruendos',
        },
        loadChildren: () =>
          import('./resources/instruendos/instruendos.module').then(
            (m) => m.InstruendosModule
          ),
      },

      {
        canActivate: [AuthGuard],
        path: 'gestaoEscolar',
        data: {
          breadcrumb: 'gestaoEscolar',
        },
        loadChildren: () =>
          import('./resources/gestaoEscolar/gestaoEscolar.module').then(
            (m) => m.GestaoEscolarNewModule
          ),
      },

      {
        canActivate: [AuthGuard],
        path: 'alistados',
        data: {
          breadcrumb: 'alistados',
        },
        loadChildren: () =>
          import('./resources/alistados/alistados.module').then(
            (m) => m.AlistadosModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SigefRoutingModule {}
