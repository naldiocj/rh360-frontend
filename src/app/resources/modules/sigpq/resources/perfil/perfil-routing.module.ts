
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerfilComponent } from './perfil.component';

const routes: Routes = [
  {
    path: ':id',
    data: {
      breadcrumb: 'Perfil',
    },
    component: PerfilComponent
  },
  {
    path: ':id/:tipo',
    data: {
      breadcrumb: 'Perfil'
    },
    component: PerfilComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilRoutingModule { }
