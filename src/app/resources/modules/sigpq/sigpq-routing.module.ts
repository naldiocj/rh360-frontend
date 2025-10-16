
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { MapaEfetividadeComponent } from './resources/estatistica/mapa-efetividade/mapa-efetividade.component';
import { MapaGeralComponent } from './resources/estatistica/mapa-geral/mapa-geral.component';
import { MobilidadeModule } from './resources/mobilidade/mobilidade.module';
import { MainContentComponent } from './resources/sigpq-tela/components/main-content/main-content.component';
// import { PiipsComponent } from './piips.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sigpq-projectos',
    pathMatch: 'full',
  },
  {
    path: 'sigpq-projectos',
    data: {
      breadcrumb: 'SIGPQ-PROJECTOS',
    },
    component: MainContentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'SIGPQ',
    },
    children: [
      {
        path: 'dashboard',
        data: {
          breadcrumb: 'Dashboard',
        },
        loadChildren: () =>
          import(
            './resources/dashboard/dashboard.module'
          ).then((m) => m.DashboardModule)
      }, {
        path: 'estatistica/mapa-estatistico',
        data: {
          breadcrumb: 'estatistica/mapa-estatistico',
        },
        component: MapaEfetividadeComponent
      }, {
        path: 'estatistica/geral',
        data: {
          breadcrumb: 'estatistica/geral',
        },
        component: MapaGeralComponent
      }, {
        path: 'perfil',
        data: {
          breadcrumb: 'Perfil',
        },
        loadChildren: () =>
          import(
            './resources/perfil/perfil.module'
          ).then((m) => m.PerfilModule)
      }
      , {
        path: 'funcionario',
        data: {
          breadcrumb: 'Funcionário',
        },
        loadChildren: () =>
          import(
            './resources/funcionario/funcionario.module'
          ).then((m) => m.FuncionarioModule)
      },
      {
        path: 'provimento',
        data: {
          breadcrumb: 'Provimento',
        },
        loadChildren: () =>
          import(
            './resources/provimento/provimento.module'
          ).then((m) => m.ProvimentoModule)
      },
      {
        path: 'relatorio',
        data: {
          breadcrumb: 'Relatório',
        },
        loadChildren: () =>
          import(
            './resources/relatorio/relatorio-geral.module'
          ).then((m) => m.RelatorioGeralModule)
      },
      {
        path: 'mobilidade',
        data: {
          breadcrumb: 'Mobilidade',
        },
        loadChildren: () =>
          import(
            './resources/mobilidade/mobilidade.module'
          ).then((m) => m.MobilidadeModule)
      },
      {
        path: 'sistuacao-disciplinar',
        data: {
          breadcrumb: 'Mobilidade',
        },
        loadChildren: () =>
          import(
            './resources/situacao-disciplinar/situacao-disciplinar.module'
          ).then((m) => m.SituacaoDisciplinarModule)
      },
      {
        path: 'config',
        data: {
          breadcrumb: 'Configurações',
        },
        loadChildren: () =>
          import(
            './resources/config/config.module'
          ).then((m) => m.ConfigModule)
      }, {
        path: 'licencas',
        data: {
          breadcrumb: 'licencas'
        },
        loadChildren: () => import('./resources/licencas/licencas.module').then(m => m.LicencasModule),
        canActivate: [AuthGuard]
      }, {
        path: 'ferias',
        data: {
          breadcrumb: 'ferias'
        },
        loadChildren: () => import('./resources/ferias/ferias.module').then(m => m.FeriasModule),
        canActivate: [AuthGuard]
      }, {
        path: 'assiduidade',
        data: {
          breadcrumb: 'pontualidade'
        },
        loadChildren: () => import('./resources/pontualidade/pontualidade.module').then(m => m.PontualidadeModule),
        canActivate: [AuthGuard]
      }, {
        path: 'passes',
        data: {
          breadcrumb: 'Passes'
        },
        loadChildren: () => import('./resources/passes/passes.module').then(m => m.PassesModule),
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SigpqRoutingModule { }
