import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { ListarComponent } from './listar/listar.component';
import { ListarAgentesComponent } from './listar-agentes/listar-agentes.component';
import { ChefiaHistoricoComponent } from './chefia-historico/chefia-historico.component';

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
      breadcrumb: 'Chefe-Comandante',
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
      },
      {
        path: 'listar-agentes',
        data: {
          breadcrumb: 'Listar Agentes',
        },
        component: ListarAgentesComponent
      },
      {
        path: ':pessoaId/agente',
        data: {
          breadcrumb: 'Histórico de Chefia',
        },
        component: ChefiaHistoricoComponent
      },
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChefeComandanteRoutingModule { }
