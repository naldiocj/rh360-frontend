
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';   
import { SigpjRoleGuard } from '@resources/modules/sigpj/core/guards/role-guard.guard';
import { SigpjUserGuard } from '@resources/modules/sigpj/core/guards/user-guard.guard';
 

const routes: Routes = [
  {
    path: 'listagem',
    canActivate:[SigpjRoleGuard, SigpjUserGuard],
    data: {
      breadcrumb: 'Listagem de detalhes',
      permission:'diverso-detalhes-show'
    },
    loadChildren: () =>
      import(
        './listar/listar.module'
      ).then((m) => m.ListarModule)
  }
   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalhesRoutingModule { }
