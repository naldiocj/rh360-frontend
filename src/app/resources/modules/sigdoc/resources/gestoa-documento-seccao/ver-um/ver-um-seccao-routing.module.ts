import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerUmSeccaoComponent } from './ver-um-seccao.component';

const routes: Routes = [
  {
    path: ':tipo/:id',
    component: VerUmSeccaoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerUmSeccaoRoutingModule { }
