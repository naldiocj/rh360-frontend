import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from '@core/guards/auth.guard';

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
        path: 'policia-nacional',
        loadChildren: () => import('./policia-nacional/policia-nacional.module').then((m) => m.PoliciaNacionalModule)
      },
      {
        path: 'estoque',
        loadChildren: () => import('./estoque-vestuarios/estoque-vestuarios.module').then((m) => m.EstoqueVestuariosModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstatisticaRoutingModule { }
