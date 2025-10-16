import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './resources/dashboard/dashboard.component';
import { DefaultComponent } from './layout/default/default.component';

// import { PiipsComponent } from './piips.component';

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
      breadcrumb: 'SIGPJ',
    },
    children: [
      {
        path: 'dashboard',
        data: {
          breadcrumb: 'Dashboard',
        },
        component: DashboardComponent,
      },
      {
        path: 'default',
        data: {
          breadcrumb: 'Dashboard',
        },
        component: DefaultComponent,
      },

      {
        path: 'queixa',
        data: {
          breadcrumb: 'CAC - Parte de atendimentos',
        },
        loadChildren: () =>
          import('./resources/cac/cac.module').then((m) => m.CACModule),
      },
      // {
      //   path: 'editor',
      //   data: {
      //     breadcrumb: 'Editor',
      //   },
      //   loadChildren: () =>
      //     import(
      //       './resources/editor/editor.module'
      //     ).then((m) => m.EditorModule)
      // },
      {
        path: 'inspeccao',
        data: {
          breadcrumb: 'Inspecção - Averiguações',
        },
        loadChildren: () =>
          import('./resources/inspeccao/inspeccao.module').then(
            (m) => m.InspeccaoModule
          ),
      },

      {
        path: 'fiscalizacao',
        data: {
          breadcrumb: 'Fiscalização - Acompanhamento ',
        },
        loadChildren: () =>
          import('./resources/fiscalizacao/fiscalizacao.module').then(
            (m) => m.FiscalizacaoModule
          ),
      },

      {
        path: 'instrucao',
        data: {
          breadcrumb: 'Instrução ',
        },
        loadChildren: () =>
          import('./resources/instrucao/instrucao.module').then(
            (m) => m.instrucaoModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SigiacRoutingModule {}
