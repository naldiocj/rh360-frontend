import { UtilizadorPortalModule } from './resources/admininstracao/utilizador-portal/utilizador-portal.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { PainelControloComponent } from './resources/painel-controlo/painel-controlo.component';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '', redirectTo: 'painel-controlo', pathMatch: 'full'
  }, {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'painel-controlo',
        component: PainelControloComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'ramos-faa',
        loadChildren: () => import('../porpna/resources/config/ramos/ramos.module').then((m) => m.RamosModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'unidades-faa',
        loadChildren: () => import('../porpna/resources/config/unidade/unidade.module').then((m) => m.UnidadeModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'patente-faa',
        loadChildren: () => import('../porpna/resources/config/patente/patente.module').then((m) => m.PatenteModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'especialidade-faa',
        loadChildren: () => import('../porpna/resources/config/especialidade/especialidade.module').then((m) => m.EspecialidadeModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'config-outras',
        loadChildren: () => import('../porpna/resources/config/outras/outras.module').then((m) => m.OutrasModule),
        canActivate: [AuthGuard]
      }, {
        path: 'adminstracao',
        loadChildren: () => import('../porpna/resources/admininstracao/utilizador-portal/utilizador-portal.module').then((m) => m.UtilizadorPortalModule),
        canActivate: [AuthGuard]
      }, {
        path: 'adminstracao-utilizador-portal',
        loadChildren: () => import('../porpna/resources/admininstracao/utilizador-portal/utilizador-portal.module').then((m) => m.UtilizadorPortalModule),
        canActivate: [AuthGuard]
      }, {
        path: 'adminstracao-utilizador-sistema',
        loadChildren: () => import('../porpna/resources/admininstracao/utilizador-sistema/utilizador-sistema.module').then((m) => m.UtilizadorSistemaModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'candidatos',
        loadChildren: () => import('../porpna/resources/candidato/candidato.module').then((m) => m.CandidatoModule),
        canActivate: [AuthGuard]
      }, {
        path: 'documentos',
        loadChildren: () => import('../porpna/resources/documentos/documentos.module').then((m) => m.DocumentosModule),
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PorpnaRoutingModule { }
