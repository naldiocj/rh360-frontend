import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './listar/listar.component';
import { AgentesPropostosComponent } from './agentes-propostos/agentes-propostos.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'listar',
    pathMatch: 'full',
  },
  {
    path: '',
    data: {
      breadcrumb: 'Em tempo',
    },
    children: [
      {
        path: 'em-tempo',
        data: {
          breadcrumb: 'Em tempo',
        },
        loadChildren:
          () => import(
            './em-tempo/em-tempo.module'
          ).then((m) => m.EmTempoModule)
      },
      {
        path: 'listar',
        data: {
          breadcrumb: 'Listar',
        },
        component: ListarComponent
      },
      {
        path: ':numero',
        component: AgentesPropostosComponent

      }

    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropostasRoutingModule { }
