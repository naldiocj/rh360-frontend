
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcusadoComponent } from './acusado.component';

const routes: Routes = [
  {
    path: ':id',
    data: {
      breadcrumb: 'Arguidos',
    },
    component: AcusadoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcusadoRoutingModule { }
