
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'em-tempo',
    pathMatch: 'full',
  },
  {
    path: '',
    data: {
      breadcrumb: 'Promoção',
    },
    children: [{
      path: 'em-tempo',
      data: {
        breadcrumb: 'Em tempo',
      },
      loadChildren: () =>
        import(
          './em-tempo/em-tempo.module'
        ).then((m) => m.EmTempoModule)
    }, {
      path: 'historico',
      data: {
        breadcrumb: 'Histórico',
      },
      loadChildren: () =>
        import(
          './historico/historico.module'
        ).then((m) => m.HistoricoModule)
    }
    ]

  }
];

@NgModule({
  // imports: [RouterModule.forChild(routes, { preloadingStrategy: PreloadAllModules })],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromocaoRoutingModule { }
