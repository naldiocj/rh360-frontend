import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { RegistarGuard } from '@resources/modules/sigv-version2/core/guards/registar.guard';
import { RegistarComponent } from './colectivo/registar/registar.component';
import { ListarComponent } from './colectivo/listar/listar.component';

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
        loadChildren: () => import('./individual/individual.module').then((m) => m.IndividualModule)
      },
      {
        path: 'colectivo',
        loadChildren: () => import('./colectivo/colectivo.module').then((m) => m.ColectivoModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanoDeDistribuicaoRoutingModule { }
