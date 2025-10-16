
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';  
import { ListarComponent } from './listar/listar.component'; 
import {RegistarOuEditarComponent} from "./registar-ou-editar/registar-ou-editar.component"

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'listagem',
        data: {
          breadcrumb: 'Listagem',
        },
        component: ListarComponent
      },
      {
        path: 'registar-ou-editar',
        data: {
          breadcrumb: 'Registro',
        },
        component: RegistarOuEditarComponent
      },
       
    ]
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MandatosRoutingModule { }
