
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { DiipComponent } from './diip.component';
import { ListarComponent } from './listar/listar.component';
import { OpcsExpedientesComponent } from './components/opcs-expedientes/opcs-expedientes.component';
import { ChefiaExpedientesComponent } from './components/chefia-expedientes/chefia-expedientes.component';
import { MinisterioExpedientesComponent } from './components/ministerio-expedientes/ministerio-expedientes.component';
import { AuditoriaExpedientesComponent } from './components/auditoria-expedientes/auditoria-expedientes.component';
import { DepartamentoExpedientesComponent } from './components/departamento-expedientes/departamento-expedientes.component';

const routes: Routes = [
  {
    path: '',
    component: DiipComponent,
    children: [
      
      {
        path: 'listagem',
        data: {
          breadcrumb: 'Listagem',
        },
        component: ListarComponent
      },
      {
        path: 'auditoria',
        data: {
          breadcrumb: 'Auditorias',
        },
        component: AuditoriaExpedientesComponent
      },
      {
        path: 'secretaria',
        data: {
          breadcrumb: 'Secretaria',
        },
        
        loadChildren: () =>
          import('./components/secretaria-expedientes/secretaria/secretaria.module').then(
            (m) => m.SecretariaModule
          ),
          canActivate: [AuthGuard],
      },
      {
        path: 'ministerio',
        data: {
          breadcrumb: 'Ministerio Publico',
        },
        component: MinisterioExpedientesComponent
      },
      {
        path: 'opcs',
        data: {
          breadcrumb: 'opcs',
        },
        component: OpcsExpedientesComponent
      },
      {
        path: 'chefia',
        data: {
          breadcrumb: 'Chefia',
        },
        component: ChefiaExpedientesComponent
      }, 
      {
        path: 'departamento',
        data: {
          breadcrumb: 'Chefia',
        },
        component: DepartamentoExpedientesComponent
      }, 
      {
        path: 'decisao',
        data: {
          breadcrumb: 'Todas as Decisões do Tribunal',
        },
        loadChildren: () =>
          import('./decisao/decisao.module').then(
            (m) => m.DecisaoModule
          ),
          canActivate: [AuthGuard],
      },
      {
        path: 'mandados',
        data: {
          breadcrumb: 'Todos os mandatos',
        },
        loadChildren: () =>
          import('./mandatos/mandatos.module').then(
            (m) => m.MandatosModule
          ),
          canActivate: [AuthGuard],
      },
      {
        path: 'empresas',
        data: {
          breadcrumb: 'Todos os empresas',
        },
        loadChildren: () =>
          import('./empresas/empresas.module').then(
            (m) => m.EmpresasModule
          ),
          canActivate: [AuthGuard],
      },
      {
        path: 'processos',
        data: {
          breadcrumb: 'Todos os processos',
        },
        loadChildren: () =>
          import('./processos/processos.module').then(
            (m) => m.ProcessosModule
          ),
          canActivate: [AuthGuard],
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiipRoutingModule { }
