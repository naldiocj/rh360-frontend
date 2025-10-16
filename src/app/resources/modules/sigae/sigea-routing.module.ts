import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './resources/dashboard/dashboard.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { ArmasCrimeComponent } from './resources/armas-crime/armas-crime.component';
import { ArmasEmpresaComponent } from './resources/armas-empresa/armas-empresa.component';
import { ArmasEstraviadasComponent } from './resources/armas-estraviadas/armas-estraviadas.component';
import { ArmasEntradaComponent } from './resources/armas-entrada/armas-entrada.component';
import { ArmasOrganicasComponent } from './resources/armas-organicas/armas-organicas.component';
import { ArmasRecolhaComponent } from './resources/armas-recolha/armas-recolha.component';
import { ExplosivosComponent } from './resources/explosivos/explosivos.component';
import { MunicoesComponent } from './resources/municoes/municoes.component';
import { RelatoriosGerarComponent } from './resources/relatorios-gerar/relatorios-gerar.component';
import { RelatoriosGeradosComponent } from './resources/relatorios-gerados/relatorios-gerados.component';

import { ArmasLotesComponent } from './resources/armas-lotes/armas-lotes.component';
import { ExplosivosLotesComponent } from './resources/explosivos-lotes/explosivos-lotes.component';
import { DirecaoComponent } from './resources/direcao/direcao.component';
import { LotesMunicoesComponent } from './resources/lotes-municoes/lotes-municoes.component';

import { EntregadasComponent } from './resources/entregadas/entregadas.component';
import { EntidadesComponent } from './resources/config/entidades/entidades.component';
import { DistribuicaoComponent } from './resources/gestao/distribuicao/distribuicao.component';
import { AtribuirComponent } from './resources/gestao/atribuir/atribuir.component';

import { CuringaComponent } from './resources/curinga/curinga.component';
import { ListarArmasComponent } from './resources/Lotes/listar-armas/listar-armas.component';
import { ListarExplosivosComponent } from './resources/Lotes/listar-explosivos/listar-explosivos.component';
import { ListarMunicaoComponent } from './resources/Lotes/listar-municao/listar-municao.component';
import { SolicitacoesComponent } from './resources/solicitacoes/solicitacoes.component';
import { PedentesComponent } from './resources/solicitacoes/pedentes/pedentes.component';
import { HistoricoComponent } from './resources/solicitacoes/historico/historico.component';
import { ArmasDesportivasComponent } from './resources/armas-desportivas/armas-desportivas.component';
import { ArmasSegurancaPessualComponent } from './resources/armas-seguranca-pessual/armas-seguranca-pessual.component';
import { ArmasCacaComponent } from './resources/armas-caca/armas-caca.component';
import { ArmasConvenioComponent } from './resources/armas-convenio/armas-convenio.component';
import { ListarGerarComponent } from './resources/relatorios-gerar/listar-gerar/listar-gerar.component';
import { ListarComponent } from './resources/quartelamento/listar/listar.component';
import { AtribuidosComponent } from './resources/quartelamento/atribuidos/atribuidos.component';
import { DashboardMaterialComponent } from './resources/dashboard-material/dashboard.component';
import { ExpolhosComponent } from './resources/quartelamento/expolhos/expolhos.component';
import { CrimesComponent } from './resources/quartelamento/crimes/crimes.component';
import { ExtraviadosComponent } from './resources/quartelamento/extraviados/extraviados.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: LayoutComponent,

    children: [
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'dashboard',
        },
        component: DashboardComponent,
      },
      {
        path: 'marcas',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'marcas',
        },
        loadChildren: () =>
          import('./resources/config/marcas/marcas.module').then(
            (m) => m.MarcasModule
          ),
      },

      {
        path: 'armas-crime',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'armas de crime',
        },
        component: ArmasCrimeComponent,
      },
      {
        path: 'dashboard-material',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'material de dashboard',
        },
        component: DashboardMaterialComponent,
      },

      {
        path: 'armas-empresa',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'armas de empresaa',
        },
        component: ArmasEmpresaComponent,
      },
      {
        path: 'armas-estraviada',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'armas extraviadas',
        },
        component: ArmasEstraviadasComponent,
      },

      {
        path: 'armas-desportivas',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'armas desportivas',
        },
        component: ArmasDesportivasComponent,
      },
      {
        path: 'armas-defesa',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'armas de defesa',
        },
        component: ArmasSegurancaPessualComponent,
      },
      {
        path: 'armas-caca',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'armas de caça',
        },
        component: ArmasCacaComponent,
      },

      {
        path: 'armas-entrada',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'armas de entrada',
        },
        component: ArmasEntradaComponent,
      },
      {
        path: 'armas-organica',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'armas de orgânica',
        },
        component: ArmasOrganicasComponent,
      },
      {
        path: 'armas-recolha',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'armas de recolha',
        },
        component: ArmasRecolhaComponent,
      },

      {
        path: 'explosivo',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'explosivos',
        },
        component: ExplosivosComponent,
      },
      {
        path: 'municoes',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'municoes',
        },
        component: MunicoesComponent,
      },
      {
        path: 'gerar',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'gerar relatorio',
        },
        component: RelatoriosGerarComponent,
      },
      {
        path: 'gerados',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'relatorio gerados',
        },
        component: RelatoriosGeradosComponent,
      },
      {
        path: 'lotes-armas',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'lotes de armas',
        },
        component: ArmasLotesComponent,
      },
      {
        path: 'lotes-explosivos',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'lotes de explosivos',
        },
        component: ExplosivosLotesComponent,
      },

      {
        path: 'listagem-armas',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'lista de armas',
        },
        component: ListarArmasComponent,
      },
      {
        path: 'listagem-explosivos',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'lista de explosivos',
        },
        component: ListarExplosivosComponent,
      },
      {
        path: 'listagem-municoes',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'lista de municoes',
        },
        component: ListarMunicaoComponent,
      },
      {
        path: 'municoes-lote',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'lista de municoes em lotes',
        },
        component: LotesMunicoesComponent,
      },
      {
        path: 'entregas',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'entregas de arma de crime',
        },
        component: EntregadasComponent,
      },
      {
        path: 'entidades',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'lista de entidades',
        },
        component: EntidadesComponent,
      },
      {
        path: 'distribuicao',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'lista de lotes atribuidos',
        },
        component: DistribuicaoComponent,
      },
      {
        path: 'alocada',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'lista de arma atribuidas',
        },
        component: AtribuirComponent,
      },
      {
        path: 'direcao',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'listaa de direcoes atribuidas',
        },
        component: DirecaoComponent,
      },

      {
        path: 'solicitacoes-enviar',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'pedidode armas',
        },
        component: SolicitacoesComponent,
      },
      {
        path: 'solicitacoes-pendentes',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'pedidos em espera',
        },
        component: PedentesComponent,
      },
      {
        path: 'solicitacoes-historico',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'historico de pedidos',
        },
        component: HistoricoComponent,
      },
      {
        path: 'armas-convenio',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'armas emprestadas',
        },
        component: ArmasConvenioComponent,
      },

      {
        path: 'gerar-Relatorio-arma',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'gerar relatorio',
        },
        component: ListarGerarComponent,
      },

      {
        path: 'aquartelamento-listar',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'Materia de aquartelamento',
        },
        component: ListarComponent,
      },
      {
        path: 'aquartelamento-atribuidos',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'Materia de aquartelamento atribuidos',
        },
        component: AtribuidosComponent,
      },


      {
        path: 'aquartelamento-expolho',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'Materia de aquartelamento expolho',
        },
        component: ExpolhosComponent,
      },     {
        path: 'aquartelamento-crime',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'Materia de aquartelamento crime',
        },
        component: CrimesComponent,
      },     {
        path: 'aquartelamento-extravio',
        canActivate: [AuthGuard],
        data: {
          breadcrumd: 'Materia de aquartelamento extravio',
        },
        component: ExtraviadosComponent,
      },

      {
        path: 'calibres',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./resources/config/calibre/calibre.module').then(
            (m) => m.CalibreModule
          ),
      },
      {
        path: 'classificacao',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./resources/config/classificacao/classificacao.module').then(
            (m) => m.ClassificacaoModule
          ),
      },
      {
        path: 'modelo',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./resources/config/modelos/modelos.module').then(
            (m) => m.ModelosModule
          ),
      },
      {
        path: 'tipos',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./resources/config/tipos/tipos.module').then(
            (m) => m.TiposModule
          ),
      },

      {
        path: 'material',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./resources/config/material/material.module').then(
            (m) => m.MaterialModule
          ),
      },
      {
        path: 'armas',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./resources/armas/armas.module').then((m) => m.ArmasModule),
      },
    ],
  },
  {
    path: '**',
    canActivate: [AuthGuard],
    component: CuringaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SigaeRoutingModule {}
