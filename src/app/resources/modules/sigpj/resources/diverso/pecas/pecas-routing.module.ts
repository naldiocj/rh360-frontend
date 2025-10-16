
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { PecasComponent } from './pecas.component';
import { SigpjRoleGuard } from '@resources/modules/sigpj/core/guards/role-guard.guard';
import { SigpjUserGuard } from '@resources/modules/sigpj/core/guards/user-guard.guard';

const routes: Routes = [
  {
    path: ':id',
    canActivate:[SigpjRoleGuard, SigpjUserGuard],
    data: {
      breadcrumb: 'Pecas',
      permission:'diverso-pecas-store'
    },
    component: PecasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PecasRoutingModule { }
