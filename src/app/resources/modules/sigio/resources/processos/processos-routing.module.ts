import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { ListarComponent } from './listar/listar.component';
import { RegistrarOuEditarComponent } from './registrar-ou-editar/registrar-ou-editar.component';
import { PlaneamentoComponent } from './planeamento/planeamento.component';


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
      breadcrumb: 'SIGIO',
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
          breadcrumb: 'Listar',
        },
       component: ListarComponent
      },
      {
        path: 'registar',
        data: {
          breadcrumb: 'Registar',
        },
       component: RegistrarOuEditarComponent
      },
      {
        path: 'planeamento',
        data: {
          breadcrumb: 'planeamento',
        },
       component: PlaneamentoComponent
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessoRoutingModule {}