
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { DetalhesComponent } from './detalhes.component';
 

const routes: Routes = [
  {
    path: ':id',
    data: {
      breadcrumb: 'Listagem de detalhes',
    },
    component:DetalhesComponent
  }
   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalhesRoutingModule { }
