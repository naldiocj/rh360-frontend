
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { ListarComponent } from './listar/listar.component';
import { RegistrarOuEditarExecucaoComponent } from './registrar-ou-editar-execucao/registrar-ou-editar-execucao.component';


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
      breadcrumb: 'SIGT',
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
        component: ListarComponent,
      },
      {
        path: 'registrar',
        data: {
          breadcrumb: 'registrar',
        },
        component: RegistrarOuEditarExecucaoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExecucaoRoutingModule {}