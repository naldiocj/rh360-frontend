
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { GeralComponent } from './geral/geral.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        data: {
          breadcrumb: 'Listagem',
        },
        component: GeralComponent
      },


      {
        path: 'estatistica',
        data: {
          breadcrumb: 'Relatórios',
        },
        loadChildren: () =>
          import('./estatistica/estatistica.module').then(
            (m) => m.EstatisticaModule
          ),
          canActivate: [AuthGuard],
      },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelatoriosRoutingModule { }
