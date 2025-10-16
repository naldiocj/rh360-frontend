import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { ListarComponent } from './listar/listar.component';
import { RegistrarOuEditarEquipamentosComponent } from './registrar-ou-editar-equipamentos/registrar-ou-editar-equipamentos.component';



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
        path: 'registrar-ou-editar-equipamentos',
        data: {
          breadcrumb: 'Registrar ou editar-equipamentos',
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
       component: RegistrarOuEditarEquipamentosComponent
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipamentosRoutingModule {}
