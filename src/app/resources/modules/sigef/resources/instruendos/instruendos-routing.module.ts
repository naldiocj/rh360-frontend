import { NgModel } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { NgModule } from '@angular/core';
import { ListarInstruendosComponent } from './listar-instruendos/listar-instruendos.component';
import { RegistrarOuEditarComponent } from '../instruendos/registrar-ou-editar/registrar-ou-editar.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'listar',
    pathMatch: 'full',
  },
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'SIGEF',
    },
    children: [
      {
        path: 'registrar-ou-editar',
        data: {
          breadcrumb: 'Registrar ou editar',
        },
      },
      {
        path: 'listar',
        data: {
          breadcrumb: 'listar',
        },
        component: ListarInstruendosComponent
      },
      {
        path: 'registrar',
        data: {
          breadcrumb: 'registrar',
        },
        component: RegistrarOuEditarComponent
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstruendosRoutingModule {}
