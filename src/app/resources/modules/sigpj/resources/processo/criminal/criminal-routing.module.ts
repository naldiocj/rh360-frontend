
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
      {
        path: 'parecer',
        data: {
          breadcrumb: 'Parecer do Processo Disciplinar',
        },
        loadChildren: () =>
          import(
            './parecer/parecer.module'
          ).then((m) => m.ParecerModule)
      },
      {
        path: 'decisao',
        data: {
          breadcrumb: 'Decisao do Parecer',
        },
        loadChildren: () =>
          import(
            './decisao/decisao.module'
          ).then((m) => m.DecisaoModule)
      },
      {
        path: 'detalhes',
        data: {
          breadcrumb: 'detalhes do Parecer',
        },
        loadChildren: () =>
          import(
            './detalhes/detalhes.module'
          ).then((m) => m.DetalhesModule)
      },
      {
        path: 'despacho',
        data: {
          breadcrumb: 'Despacho do Processo Disciplinar',
        },
        loadChildren: () =>
          import(
            './despacho/despacho.module'
          ).then((m) => m.DespachoModule)
      },
    ]
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CriminalRoutingModule { }
