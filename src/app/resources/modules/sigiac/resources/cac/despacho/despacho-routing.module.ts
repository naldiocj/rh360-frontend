
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DespachoComponent } from './despacho.component';

const routes: Routes = [
  {
    path: ':id',
    data: {
      breadcrumb: 'Autos de Queixa',
    },
    component: DespachoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DespachoRoutingModule { }
