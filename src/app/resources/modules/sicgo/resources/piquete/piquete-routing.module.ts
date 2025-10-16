import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarOcorrenciaComponent } from './listar/listar.component';
import { RegistarOuEditarComponent } from './registo-de-ocorrencias/registar-ou-editar/registar-ou-editar.component';
import { FormulariosComponent } from './formularios/formularios.component';
import { IntervenientesComponent } from './intervenientes/intervenientes.component';

import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ListarOcorrenciaComponent,
      },
      {
        path: 'registar-ou-editar',
        component: RegistarOuEditarComponent,
        data: { breadcrumb: 'Registro' },
      },

      // Rotas com Lazy Loading protegidas por AuthGuard
      {
        path: 'formularios',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Todos os Formulários' },
        loadChildren: () =>
          import('./formularios/formularios.module').then(m => m.FormulariosModule),
      },
      {
        path: 'empresas',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Todas as Empresas' },
        loadChildren: () =>
          import('./empresas/empresas.module').then(m => m.EmpresasModule),
      },
      {
        path: 'interveniente',
        canActivate: [AuthGuard],
        component: IntervenientesComponent,
        data: { breadcrumb: 'Testemunhas e Intervenientes' },
        loadChildren: () =>
          import('./intervenientes/intervenientes.module').then(m => m.IntervenienteModule),
      },
      {
        path: 'exames',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Todos os Exames' },
        loadChildren: () =>
          import('./exames/exames.module').then(m => m.ExamesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PiqueteRoutingModule {}
