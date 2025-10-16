
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { AssociacoesCriminosasComponent } from './associacoes-criminosas/associacoes-criminosas.component';
import { DashboardSicgoDinfopComponent } from '../../dashboard/dashboard-sicgo-dinfop/dashboard-sicgo-dinfop.component';
import { OcorrenciasComponent } from './ocorrencias/ocorrencias.component';
 import { GestInformacaoComponent } from './gest-informacao/gest-informacao.component';
import { ExpedientesComponent } from './expedientes/expedientes.component';
import { NotificacoesComponent } from './notificacoes/notificacoes/notificacoes.component';
 
const routes: Routes = [

  {
    path: '',
    children: [
      {
        path: '', 
        component: DashboardSicgoDinfopComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'ocorrencias',
        
        component: OcorrenciasComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'associacao',
        data: {
          breadcrumb: 'Associação criminosa',
        },
        component: AssociacoesCriminosasComponent,
        loadChildren: () =>
          import('./associacoes-criminosas/associacoes-criminosas.module').then(
            (m) => m.AssociacoesCriminosasModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'expedientes',
        data: {
          breadcrumb: 'expedientes',
        }, 
        component: ExpedientesComponent,
        loadChildren: () =>
          import('./expedientes/expedientes.module').then(
            (m) => m.ExpedientesModule
          ),
        canActivate: [AuthGuard],
      },

      {
        path: 'delituosos',
        data: {
          breadcrumb: 'Potencial Delituoso',
        },
        loadChildren: () =>
          import('./delituoso/delituoso.module').then(
            (m) => m.DelituosoModule
          ),
        canActivate: [AuthGuard],
      },
      
      {
        path: 'grupos',
        data: {
          breadcrumb: 'Organização Criminosa',
        },
        loadChildren: () =>
          import('./grupos/grupos.module').then(
            (m) => m.GruposModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'informacao',
        data: {
          breadcrumb: 'Potencial Delituoso',
        },
        // component: GestInformacaoComponent,
        loadChildren: () =>
          import('./gest-informacao/gest-informacao.module').then(
            (m) => m.GestInformacaoModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'mandatos',
        data: {
          breadcrumb: 'Mandados',
        },
        loadChildren: () =>
          import('./mandatos/mandatos.module').then(
            (m) => m.MandatosModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'decisao',
        data: {
          breadcrumb: 'Decisão Tribunal',
        },
        loadChildren: () =>
          import('./decisao/decisao.module').then(
            (m) => m.DecisaoModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'dados',
        data: {
          breadcrumb: 'Dados Operativos',
        },
        loadChildren: () =>
          import('./dados/dados.module').then(
            (m) => m.DadosModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'processos',
        data: {
          breadcrumb: 'Investigação e Instrução Processual',
        },
        loadChildren: () =>
          import('./processos/processos.module').then(
            (m) => m.ProcessosModule
          ),
        canActivate: [AuthGuard],
      },

      {
        path: 'config',
        data: {
          breadcrumb: 'Investigação e Instrução Processual',
        },
        loadChildren: () =>
          import('./acl/acl.module').then(
            (m) => m.AclModule
          ),
        canActivate: [AuthGuard],
      },
    ]
  },
  {
    path: 'pedidos',
    data: {
      breadcrumb: 'Notifica',
    }, 
    component: NotificacoesComponent,
    
  },
  { path: 'informantes',
    data: {
      breadcrumb: 'Informacao',
    }, 
    component: GestInformacaoComponent,
  loadChildren: () => import('./gest-informacao/gest-informacao.module').then(m => m.GestInformacaoModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DinfopRoutingModule { }
