
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarComponent } from './listar/listar.component';
// import { SigpjRoleGuard } from '@resources/modules/sigpj/core/guards/role-guard.guard';
// import { SigpjUserGuard } from '@resources/modules/sigpj/core/guards/user-guard.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'listagem',
        // canActivate: [SigpjRoleGuard, SigpjUserGuard],
        data: {
          breadcrumb: 'Listagem',
          permission: 'disciplinar-show'
        },
        component: ListarComponent
      },
      // {
      //   path: 'ver-pecas',
      //   // canActivate: [SigpjRoleGuard, SigpjUserGuard],
      //   data: {
      //     breadcrumb: 'ver pecas',
      //     permission: 'disciplinar-pecas-show'
      //   },
      //   loadChildren: () =>
      //     import(
      //       './pecas/pecas.module'
      //     ).then((m) => m.PecasModule)
      // },
      // {
      //   path: 'novos-arguidos',
      //   // canActivate: [SigpjRoleGuard, SigpjUserGuard],
      //   data: {
      //     breadcrumb: 'Adiconar Novos Arguidos',
      //     permission: 'disciplinar-arguido-store'
      //   },
      //   loadChildren: () =>
      //     import(
      //       './arguidos/arguidos.module'
      //     ).then((m) => m.ArguidosModule)
      // },
      {
        path: 'detalhes',
        data: {
          breadcrumb: 'detalhes do Processo Disciplinar',
        },
        loadChildren: () =>
          import(
            './detalhes/detalhes.module'
          ).then((m) => m.DetalhesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisciplinarRoutingModule { }
