import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'layout',
    pathMatch: 'full'
  },

  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'layout',
        component: LayoutComponent
      },
      {
        path: 'individual',
        loadChildren : () => import('./individual/individual.module').then((m) => m.IndividualModule)
      },
      {
        path: 'colectiva',
        loadChildren : () => import('./colectiva/colectiva.module').then((m) => m.ColectivaModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistribuicaoRoutingModule { }
