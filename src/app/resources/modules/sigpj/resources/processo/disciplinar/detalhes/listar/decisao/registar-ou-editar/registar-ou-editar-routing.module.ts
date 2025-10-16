
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { RegistarOuEditarComponent } from './registar-ou-editar.component';

const routes: Routes = [
  {
    path: ':id',
    data: {
      breadcrumb: 'Registro de Decisao',
    },
    component: RegistarOuEditarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistarOuEditarRoutingModule { }
