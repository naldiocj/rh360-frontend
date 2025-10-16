
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigpjRoleGuard } from '@resources/modules/sigpj/core/guards/role-guard.guard';
import { SigpjUserGuard } from '@resources/modules/sigpj/core/guards/user-guard.guard';
const routes: Routes = [
  
  {
    path: 'registar-ou-editar',
    canActivate:[SigpjRoleGuard, SigpjUserGuard],
    data: {
      breadcrumb: 'Registar  de Parecer',
      permission:'disciplinar-parecer-store'
    },
    loadChildren: () =>
      import(
        './registar-ou-editar/registar-ou-editar.module'
      ).then((m) => m.RegistarOuEditarModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParecerRoutingModule { }
