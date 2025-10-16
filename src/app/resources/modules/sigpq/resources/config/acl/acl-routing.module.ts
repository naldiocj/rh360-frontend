
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';


const routes: Routes = [{
  path: '',
  redirectTo: 'utilizador',
  pathMatch: 'full',
},
{
  path: '',
  canActivate: [AuthGuard],
  data: {
    breadcrumb: 'Utilizador',
  },
  children: [{
    path: 'utilizador',
    data: {
      breadcrumb: 'Utilizador',
    },
    loadChildren: () =>
      import(
        './utilizador/utilizador.module'
      ).then((m) => m.UtilizadorModule)
  }, {
    path: 'funcao',
    data: {
      breadcrumb: 'Função',
    },
    loadChildren: () =>
      import(
        './funcao/funcao.module'
      ).then((m) => m.FuncaoModule)
  },
  {
    path: 'permissao',
    data: {
      breadcrumb: 'Permissão'
    },
    loadChildren: () =>
      import('./permissao/permissao.module')
        .then((m) => m.PermissaoModule)
  }
  ]
}
];

@NgModule({
  // imports: [RouterModule.forChild(routes, { preloadingStrategy: PreloadAllModules })],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AclRoutingModule { }
