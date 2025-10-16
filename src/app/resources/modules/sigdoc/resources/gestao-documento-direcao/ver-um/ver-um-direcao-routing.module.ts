import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerUmDirecaoComponent } from './ver-um-direcao.component';

const routes: Routes = [
  {
    path: ':tipo/:id',
    component: VerUmDirecaoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerUmRoutingModule { }
