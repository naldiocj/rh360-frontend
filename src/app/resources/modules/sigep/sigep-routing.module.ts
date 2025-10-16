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
      breadcrumb: 'SIGEP',
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
        path: 'resultados',
        data: {
          breadcrumb: 'Todos os resultados',
        },
        loadChildren: () =>
          import('./resources/resultados/resultados.module').then(
            (m) => m.ResultadosModule
          ),
      },
      

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SigepRoutingModule {}
