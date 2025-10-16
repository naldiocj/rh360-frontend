import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerUmDepartamentoComponent } from './ver-um-departamento.component';

const routes: Routes = [
  {
    path: ':tipo/:id',
    component: VerUmDepartamentoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerUmDepartamentoRoutingModule { }
