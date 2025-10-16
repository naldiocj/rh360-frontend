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
      breadcrumb: 'SIGIO',
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
        path: 'processos',
        data: {
          breadcrumb: 'Processo',
        },
        loadChildren: () =>
          import('./resources/processos/processos.module').then(
            (m) => m.ProcessoModule
          ),
      },
      {
        canActivate: [AuthGuard],
        path: 'equipamentos',
        data: {
          breadcrumb: 'Equipamentos',
        },
        loadChildren: () =>
          import('./resources/equipamentos/equipamentos.module').then(
            (m) => m.EquipamentosModule
          ),
      },
      {
        canActivate: [AuthGuard],
        path: 'execucao',
        data: {
          breadcrumb: 'Execucao',
        },
        loadChildren: () =>
          import('./resources/execucao/execucao.module').then(
            (m) => m.ExecucaoModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SigioRoutingModule {}