
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
// import { LayoutComponent } from '@resources/modules/sigt/layout/layout.component';
import { ListarComponent } from './listar/listar.component';
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
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'SIGT',
    },
    children: [
      {
        path: 'registar-ou-editar',
        data: {
          breadcrumb: 'Registar ou editar',
        },
        // component: RegistarOuEditarComponent
      },
      {
        path: 'listar',
        data: {
          breadcrumb: 'Listar',
        },
        component: ListarComponent
      }
    ]

  }
];

@NgModule({
  // imports: [RouterModule.forChild(routes, { preloadingStrategy: PreloadAllModules })],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UtilizadorRoutingModule { }
