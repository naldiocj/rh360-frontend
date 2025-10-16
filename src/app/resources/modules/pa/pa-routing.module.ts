
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './resources/dashboard/dashboard.component';
import { PerfilComponent } from './resources/perfil/perfil.component';
import { DadosComponent } from './resources/dados/dados.component';
import { ArquivoComponent } from './resources/arquivo/arquivo.component';

import { PushComponent } from './resources/push/push.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'PA'
    },
    children: [
      {
        path: 'dashboard',
        data: {
          breadcrumb: 'Dashboard'
        },
        canActivate: [AuthGuard],
        component: DashboardComponent
      },
      {
        canActivate: [AuthGuard],
        path: 'perfil',
        component: PerfilComponent
      },
      {
        canActivate: [AuthGuard],
        path: 'dados',
        component: DadosComponent
      },
      // {
      //   canActivate: [AuthGuard],
      //   path: 'arquivo',
      //   component: ArquivoComponent
      // },
      {
        canActivate: [AuthGuard],
        path: 'arquivo',
        loadChildren: () =>
          import('./resources/arquivos/arquivos.module').then(m => m.ArquivosModule)
      },
      {
        canActivate: [AuthGuard],
        path: 'reclamation',
        data: {
          breadcrumb: "PA"
        },
        loadChildren: () =>
          import("./../pa/resources/reclamation/reclamation.module")
            .then((m) => m.ReclamationModule)
      },
      {
        canActivate: [AuthGuard],
        path: 'solicitacao',
        data: {
          breadcrumb: "PA"
        },
        loadChildren: () =>
          import('./../pa/resources/pa-solicitacao/pa-solicitacao.module')
            .then((m) => m.PaSolicitacaoModule)
      }, {
        canActivate: [AuthGuard],
        path: 'work',
        data: {
          breadcrumb: 'PA'
        },
        loadChildren: () =>
          import('./../pa/resources/work/work.module')
            .then((m) => m.WorkModule)
      }
      , {
        canActivate: [AuthGuard],
        path: 'push',
        data: {
          breadcrumb: "Push"
        },
        component: PushComponent
      }, {
        canActivate: [AuthGuard],
        path: 'meios-atribuido',
        loadChildren: () => import('../pa/resources/meio-atribuido/meio-atribuido.module').then((m) => m.MeioAtribuidoModule)

      }, {
        canActivate: [AuthGuard],
        path: 'ordem-de-servico',
        loadChildren: () => import('../pa/resources/ordem-servico/ordem-servico.module').then((m) => m.MeioAtribuidoModule)

      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaRoutingModule { }
