
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { ListarComponent } from './listar/listar.component';
import { ListarAgentesComponent } from './listar-agentes/listar-agentes.component';
import { VerAgentesMovidosComponent } from './ver-agentes-movidos/ver-agentes-movidos.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      // {
      //   path: 'registar-ou-editar',
      //   data: {
      //     breadcrumb: 'Registar ou editar',
      //   },
      //   component: RegistarOuEditarComponent
      // },
      // {
      //   path: 'registar-ou-editar/:id',
      //   data: {
      //     breadcrumb: 'Registar ou editar',
      //   },
      //   component: RegistarOuEditarComponent
      // },
      {
        path: 'listar',
        data: {
          breadcrumb: 'Listar',
        },
        component: ListarComponent
      },
      {
        path: 'listar-agentes',
        data: {
          breadcrumb: 'Agentes',
        },
        component: ListarAgentesComponent
      },{
        path: ':guia',
        component: VerAgentesMovidosComponent
      }
    ]

  }
];

@NgModule({
  // imports: [RouterModule.forChild(routes, { preloadingStrategy: PreloadAllModules })],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MobilidadeRoutingModule { }
