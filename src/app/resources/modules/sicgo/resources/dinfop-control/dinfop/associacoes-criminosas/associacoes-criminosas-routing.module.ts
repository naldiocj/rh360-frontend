import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { AssociacoesCriminosasComponent } from './associacoes-criminosas.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    canActivate: [AuthGuard], // Adicionando o AuthGuard aqui também, se necessário
    children: [
      {
        path: 'associacao-delituoso',
        data: { breadcrumb: 'Associação de Delituoso' },
        loadChildren: () =>
          import('./associacoes-delituosos/associacoes-delituosos.module').then(
            (m) => m.AssociacoesDelituososModule
          ),
        canActivate: [AuthGuard], // Mantenha isto se desejar proteger o acesso a este módulo
      },
      {
        path: 'associacao-grupos',
        data: { breadcrumb: 'Associação de Grupos Criminosos' },
        loadChildren: () =>
          import('./associacoes-grupos/associacoes-grupos.module').then(
            (m) => m.AssociacoesGruposModule
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssociacoesCriminosasRoutingModule {}
