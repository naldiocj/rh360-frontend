
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './resources/dashboard/dashboard.component';
import { DefaultComponent } from './layout/default/default.component';
import { MainContentComponent } from './resources/sigpj-tela/components/main-content/main-content.component';

// import { PiipsComponent } from './piips.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'sigpj-projectos',
    pathMatch: 'full',
  },
  {
    path: 'sigpj-projectos',
    data: {
      breadcrumb: 'SIGPJ-PROJECTOS',
    },
    component: MainContentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'SIGPJ',
    },
    children: [
      {
        path: 'sigpj-projects',
        //canActivate:[SigpjRoleGuard, SigpjUserGuard],
        data: {
          breadcrumb: 'SIGPJ',
         // permission:'sigpj-painel-show'
        },
        component: MainContentComponent
      },
      {
        path: 'dashboard',
        //canActivate:[SigpjRoleGuard, SigpjUserGuard],
        data: {
          breadcrumb: 'Dashboard',
         // permission:'sigpj-painel-show'
        },
        component: DashboardComponent
      },
      {
        path: 'main-content',
        data: {
          breadcrumb: 'main-content',
        },
        loadChildren: () =>
          import(
            './resources/sigpj-tela/sigpj-tela.module'
          ).then((m) => m.SigpjTelaModule)
      },
      {
        path: 'processo',
        data: {
          breadcrumb: 'Todos os Processos',
        },
        loadChildren: () =>
          import(
            './resources/processo/processo.module'
          ).then((m) => m.ProcessoModule)
      }, {
        path: 'admin',
        data: {
          breadcrumb: 'Administração',
        },
        loadChildren: () =>
          import(
            './resources/configuracao/admin.module'
          ).then((m) => m.AdminModule)
      }, 
      {
        path: 'diverso',
        data: {
          breadcrumb: 'Diversos',
        },
        loadChildren: () =>
          import(
            './resources/diverso/diverso.module'
          ).then((m) => m.DiversoModule)
      },
 
      {
        path: 'perfil',
        data: {
          breadcrumb: 'Perfil',
        },
        loadChildren: () =>
          import(
            './resources/novodocumento/perfil.module'
          ).then((m) => m.PerfilModule)
      }, 
      {
        path: 'editor',
        data: {
          breadcrumb: 'Editor',
        },
        loadChildren: () =>
          import(
            './resources/editor/editor.module'
          ).then((m) => m.EditorModule)
      },
      {
        path: 'relatorio',
        data: {
          breadcrumb: 'Relatorios ',
        },
        loadChildren: () =>
          import(
            './resources/relatorio/relatorio.module'
          ).then((m) => m.RelatorioModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SigpjRoutingModule { }
