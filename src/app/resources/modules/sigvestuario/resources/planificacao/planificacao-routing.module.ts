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
        path: 'plano-de-necessidades',
        loadChildren : () => import('./plano-de-necessidades/plano-de-necessidades.module').then((m) => m.PlanoDeNecessidadesModule)
      },
      {
        path: 'plano-de-distribuicao',
        loadChildren : () => import('./plano-de-distribuicao/plano-de-distribuicao.module').then((m) => m.PlanoDeDistribuicaoModule)
      },
      {
        path: 'pre-despacho',
        loadChildren : () => import('./pre-despacho/pre-despacho.module').then((m) => m.PreDespachoModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanificacaoRoutingModule { }
