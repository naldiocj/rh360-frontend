
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';  
import { ArguidosComponent } from './arguidos.component';

const routes: Routes = [
  {
    path: ':id',
    data: {
      breadcrumb: 'Arguidos',
    },
    component: ArguidosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArguidosRoutingModule { }
