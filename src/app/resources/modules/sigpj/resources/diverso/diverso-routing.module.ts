
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';  
import { ListarComponent } from './listar/listar.component'; 
import {RegistarOuEditarComponent} from "./registar-ou-editar/registar-ou-editar.component"
import { SigpjRoleGuard } from '../../core/guards/role-guard.guard';
import { SigpjUserGuard } from '../../core/guards/user-guard.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'listagem',
        canActivate:[SigpjRoleGuard, SigpjUserGuard],
        data: {
          breadcrumb: 'Listagem',
          permission:'diverso-show'
        },
        component: ListarComponent
      },
      {
        path: 'registar-ou-editar',
        canActivate:[SigpjRoleGuard, SigpjUserGuard],
        data: {
          breadcrumb: 'Registro',
          permission:'diverso-store'
        },
        component: RegistarOuEditarComponent
      },
      {
        path: 'ver-pecas',
        data: {
          breadcrumb: 'ver pecas',
        },
        loadChildren: () =>
          import(
            './pecas/pecas.module'
          ).then((m) => m.PecasModule)
      },
      {
        path: 'detalhes',
        data: {
          breadcrumb: 'detalhes do Processo Disciplinar',
        },
        loadChildren: () =>
          import(
            './detalhes/detalhes.module'
          ).then((m) => m.DetalhesModule)
      },
    ]
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiversoRoutingModule { }
