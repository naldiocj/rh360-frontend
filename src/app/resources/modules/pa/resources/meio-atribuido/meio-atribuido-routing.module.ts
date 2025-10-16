import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './resources/listar/listar.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'listar', pathMatch: 'full'
  },{
    path: 'listar',
    component: ListarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeioAtribuidoRoutingModule { }
