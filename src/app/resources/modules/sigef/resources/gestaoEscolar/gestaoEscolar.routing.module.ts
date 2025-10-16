import { NgModel } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { NgModule } from '@angular/core';
import { CursoComponent } from './curso/curso.component';
import { DisciplinaComponent } from './disciplina/disciplina.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'listar',
    pathMatch: 'full',
  },
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'SIGEF',
    },

    children: [
      {
        path: 'registrar-ou-editar',
        data: {
          breadcrumb: 'Registrar ou editar',
        },
      },
      {
        path: 'listar-cursos',
        data: {
          breadcrumb: 'listar',
        },
        component: CursoComponent,
      },
      {
        path: 'listar-disciplinas',
        data: {
          breadcrumb: 'listar',
        },
        component: DisciplinaComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestaoEscolarNewRoutingModule {}
