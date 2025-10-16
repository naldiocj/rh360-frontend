import { NgModel } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { NgModule } from '@angular/core';
import { ListarAvaliarComponent } from './avaliar/listar-avaliar/listar-avaliar.component';
import { ListarMapasComponent } from './mapas/listar-mapas/listar-mapas.component';

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
        path: 'listar-avaliar',
        data: {
          breadcrumb: 'Listar',
        },
        component: ListarAvaliarComponent
      },
      
      {
        path: 'listar-mapas',
        data: {
          breadcrumb: 'Listar',
        },
        component: ListarMapasComponent
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvaliacoesRoutingModule {}
