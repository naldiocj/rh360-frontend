
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarComponent } from './listar/listar.component';

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
        path: ':id',
        data: {
          breadcrumb: 'Listar',
        }, 
        component: ListarComponent
      }
    ]

  }
];

@NgModule({
  // imports: [RouterModule.forChild(routes, { preloadingStrategy: PreloadAllModules })],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmTempoRoutingModule { }
