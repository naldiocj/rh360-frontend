import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import {RegistarOuEditarComponent} from "./registar/registar-ou-editar/registar-ou-editar.component"
import { ListarComponent } from './listar/listar.component';
import { MaosBiometricoComponent } from './modal/maos-biometrico/maos-biometrico.component';
import { DelituosoDetalhesComponent } from './delituoso-detalhes/delituoso-detalhes.component';
import { IdentificadorComponent } from './buscas/identificador/identificador.component';
 

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        data: {
          breadcrumb: 'Listagem',
        },
        component: ListarComponent
      },
       
      {
        path: 'identificador',
        data: {
          breadcrumb: 'Listagem',
        },
        component: IdentificadorComponent
      },
       
      { path: 'detalhes-delituoso/:encodedId',
        data: {
          breadcrumb: 'Registro',
        },
        component: DelituosoDetalhesComponent },
      {
        path: 'maos',
        data: {
          breadcrumb: 'Registro',
        },
        component: MaosBiometricoComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DelituosoRoutingModule { }
