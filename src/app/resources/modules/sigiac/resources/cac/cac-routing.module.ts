
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { ListarComponent } from './listar/listar.component';
import { RegistarOuEditarComponent } from "./registar-ou-editar/registar-ou-editar.component"

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
        path: 'auto',
        data: {
          breadcrumb: 'gerar autos de queixa',
        },
        loadChildren: () =>
          import(
            './auto/auto.module'
          ).then((m) => m.AutoModule)
      },
      {
        path: 'despacho',
        data: {
          breadcrumb: 'anexar despachos',
        },
        loadChildren: () =>
          import(
            './despacho/despacho.module'
          ).then((m) => m.DespachoModule)
      }, 
      {
        path: 'acusado',
        data: {
          breadcrumb: 'adicionar acusados',
        },
        loadChildren: () =>
          import(
            './acusado/acusado.module'
          ).then((m) => m.AcusadoModule)
      },
      {
        path: 'detalhes',
        data: {
          breadcrumb: 'detalhes do CAC',
        },
        loadChildren: () =>
          import(
            './detalhes/detalhes.module'
          ).then((m) => m.DetalhesModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CACRoutingModule { }
