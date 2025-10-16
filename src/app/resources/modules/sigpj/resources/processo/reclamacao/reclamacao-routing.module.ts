
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';  
import { ListarComponent } from './listar/listar.component'; 
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';  
import { SigpjRoleGuard } from '@resources/modules/sigpj/core/guards/role-guard.guard';
import { SigpjUserGuard } from '@resources/modules/sigpj/core/guards/user-guard.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'listagem',
        canActivate:[SigpjRoleGuard, SigpjUserGuard],
        data: {
          breadcrumb: 'Listagem',
          permission:'reclamacao-show'
        },
        component: ListarComponent
      },
      {
        path: 'registar-ou-editar',
        canActivate:[SigpjRoleGuard, SigpjUserGuard],
        data: {
          breadcrumb: 'Registar ou Editar',
          permission:'reclamacao-store'
        },
        component: RegistarOuEditarComponent
      } ,
      {
        path: 'detalhes',
        data: {
          breadcrumb: 'detalhes do Parecer',
        },
        loadChildren: () =>
          import(
            './detalhes/detalhes.module'
          ).then((m) => m.DetalhesModule)
      },
      {
        path: 'ver-pecas',
        canActivate:[SigpjRoleGuard, SigpjUserGuard],
        data: {
          breadcrumb: 'pecas da  Reclamação',
          permission:'reclamacao-pecas-store'
        },
        loadChildren: () =>
          import(
            './pecas/pecas.module'
          ).then((m) => m.PecasModule)
      },
      {
        path: 'novos-arguidos',
        canActivate:[SigpjRoleGuard, SigpjUserGuard],
        data: {
          breadcrumb: 'Adiconar Novos Arguidos',
          permission:'reclamacao-arguido-store'
        },
        loadChildren: () =>
          import(
            './arguidos/arguidos.module'
          ).then((m) => m.ArguidosModule)
      }
    ]
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReclamacaoRoutingModule { }
