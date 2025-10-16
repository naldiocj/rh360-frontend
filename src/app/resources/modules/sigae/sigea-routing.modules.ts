import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './resources/dashboard/dashboard.component';
import { AuthGuard } from '@core/guards/auth.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    data: {
      breadcrumb: 'SIGAE',
    },
    children: [
      {
        path: 'dashboard',
        canActivate: [AuthGuard],

        data: {
          breadcrumb: 'Dashboard',
        },
        component: DashboardComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SigaeRoutingModule {}
