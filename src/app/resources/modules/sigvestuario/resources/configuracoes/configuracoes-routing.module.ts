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
    children:[
      {
        path: 'layout',
        component: LayoutComponent
      },
      {
        path: 'tipo-de-meios',
        loadChildren: () => import('./tipo-de-meios/tipo-de-meios.module').then((m) => m.TipoDeMeiosModule)
      },
      {
        path: 'designacao-de-meios',
        loadChildren: () => import('./designacao-de-meios/designacao-de-meios.module').then((m) => m.DesignacaoDeMeiosModule)
      },
      {
        path: 'tipo-de-norma-pessoas',
        loadChildren: () => import('./tipo-de-norma-pessoas/tipo-de-norma-pessoas.module').then((m) => m.TipoDeNormaPessoasModule)
      },
      {
        path: 'designacao-de-norma-pessoas',
        loadChildren: () => import('./designacao-de-norma-pessoas/designacao-de-norma-pessoas.module').then((m) => m.DesignacaoDeNormaPessoasModule)
      },
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracoesRoutingModule { }
