
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarComponent } from './listar/listar.component';
import { AgentePorOrdemComponent } from './agente-por-ordem/agente-por-ordem.component';
// import { LayoutComponent } from '../../layout/layout.component';
// import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
// import { PiipsComponent } from './piips.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'listar',
    pathMatch: 'full',
  },
  {
    path: '',
    data: {
      breadcrumb: 'SIGPQ',
    },
    children: [
      {
        path: 'listar',
        data: {
          breadcrumb: 'Listagem',
        },
        component: ListarComponent
      },

      {
        path: 'promocao',
        data: {
          breadcrumb: 'Promoção',
        },
        loadChildren: () =>
          import(
            './promocao/promocao.module'
          ).then((m) => m.PromocaoModule)
      },
      {
        path: 'propostas',
        loadChildren: () =>
          import(
            './propostas/propostas.module'
          ).then((m) => m.PropostasModule)
      },
      {
        path: 'graduacao',
        data: {
          breadcrumb: 'Graduação',
        },
        loadChildren: () =>
          import(
            './graduacao/graduacao.module'
          ).then((m) => m.GraduacaoModule)
      },
      {
        path: ':numero',
        component: AgentePorOrdemComponent
      }
    ]

  }
];

@NgModule({
  // imports: [RouterModule.forChild(routes, { preloadingStrategy: PreloadAllModules })],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProvimentoRoutingModule { }
