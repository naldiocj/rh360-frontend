
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { ListarComponent } from './listar.component';

const routes: Routes = [
  {
    path: ':id',
    data: {
      breadcrumb: 'Listagem de detalhes',
    },
    component: ListarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarRoutingModule { }
