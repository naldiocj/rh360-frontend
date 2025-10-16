
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { ListarComponent } from './listar/listar.component';

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
      breadcrumb: 'Curso',
    },
    children: [
      {
        path: 'registar-ou-editar',
        data: {
          breadcrumb: 'Registar ou editar',
        },
      },
      {
        path: 'listar',
        data: {
          breadcrumb: 'Listar',
        },
        component: ListarComponent
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TipoDeFormacaoRoutingModule { }
