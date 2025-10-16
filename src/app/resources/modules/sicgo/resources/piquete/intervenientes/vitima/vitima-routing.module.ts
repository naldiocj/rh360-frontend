
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarComponent } from './listar/listar.component';
 
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        data: {
          breadcrumb: 'Listagem',
        },
        component: ListarComponent
      },
      

    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VitimaRoutingModule { }
