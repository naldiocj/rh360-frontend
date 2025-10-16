import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerUmComponent } from './ver-um.component';

const routes: Routes = [
  {
    path: ':tipo/:id',
    component: VerUmComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerUmRoutingModule { }
