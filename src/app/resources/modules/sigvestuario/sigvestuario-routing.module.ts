import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './resources/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: '',
    canActivate: [AuthGuard],
    data: [
      { breadcrumb: '' }
    ],
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        data: [
          { breadcrumb: 'Dashboard' }
        ],
        component: DashboardComponent
      },
      {
        path: 'planificacao',
        data: [
          { breadcrumb: 'planificacao' }
        ],
        loadChildren: () => import('./resources/planificacao/planificacao.module').then(m => m.PlanificacaoModule)
      },
      {
        path: 'abastecimento',
        data: [
          { breadcrumb: 'abastecimento' }
        ],
        loadChildren: () => import('./resources/abastecimento/abastecimento.module').then(m => m.AbastecimentoModule)
      },
      {
        path: 'distribuicao',
        data: [
          { breadcrumb: 'distribuicao' }
        ],
        loadChildren: () => import('./resources/distribuicao/distribuicao.module').then(m => m.DistribuicaoModule)
      },
      {
        path: 'gestao-de-estoque',
        data: [
          { breadcrumb: 'gestao-de-estoque' }
        ],
        loadChildren: () => import('./resources/gestao-de-estoque/gestao-de-estoque.module').then(m => m.GestaoDeEstoqueModule)
      },
      {
        path: 'gestao-de-pedidos',
        data: [
          { breadcrumb: 'gestao-de-estoque' }
        ],
        loadChildren: () => import('./resources/gestao-de-pedidos/gestao-de-pedidos.module').then(m => m.GestaoDePedidosModule)
      },
      {
        path: 'relatorios',
        data: [
          {breadcrumb: 'relatorios'}
        ],
        loadChildren: () => import ('./resources/relatorios/relatorios.module').then(m => m.RelatoriosModule)
      },
      {
        path: 'configuracoes',
        data: [
          { breadcrumb: 'configuracoes' }
        ],
        loadChildren: () => import('./resources/configuracoes/configuracoes.module').then(m => m.ConfiguracoesModule)
      },
      {
        path: 'estatistica',
        data: [
          { breadcrumb: 'estatistica' }
        ],
        loadChildren: () => import('./resources/estatistica/estatistica.module').then(m => m.EstatisticaModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SigvestuarioRoutingModule { }
