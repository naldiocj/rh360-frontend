
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';  
import { ListarComponent } from './listar/listar.component'; 
import {RegistarOuEditarComponent} from "./registar-ou-editar/registar-ou-editar.component"
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
          permission:'sigpj-role-show'
        },
        component: ListarComponent
      },
      {
        path: 'registar-ou-editar',
        canActivate:[SigpjRoleGuard, SigpjUserGuard],
        data: {
          breadcrumb: 'Registro',
          permission:'sigpj-role-store'
        },
        component: RegistarOuEditarComponent
      },
      {
        path: 'permission',
        canActivate:[SigpjRoleGuard, SigpjUserGuard],
        data: {
          breadcrumb: 'Permission for Roles',
          permission:'sigpj-role-permission-store'
        },
        loadChildren: () =>
          import(
            './permission/permission.module'
          ).then((m) => m.PermissionModule)
      },
    ]
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilRoutingModule { }
