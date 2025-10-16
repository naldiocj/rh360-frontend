import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
/* import { RegistarComponent } from './individual/registar/registar.component';
import { ListarComponent } from './individual/listar/listar.component'; */
import { RegistarGuard } from '@resources/modules/sigv-version2/core/guards/registar.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'layout',
    pathMatch: 'full'
  },

  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'layout',
        component: LayoutComponent
      },
      {
        path: 'individual',
        loadChildren : () => import('./individual/individual.module').then((m) => m.IndividualModule)
      },
      {
        path: 'colectivo',
        loadChildren : () => import('./colectivo/colectivo.module').then((m) => m.ColectivoModule)
      }
      /* {
        path: 'registar',
        canDeactivate: [RegistarGuard],
        component: RegistarComponent
      },
      {
        path: 'listar',
        component: ListarComponent
      }, */
      /* {
        path: 'listar/:id',
        component: ListarMeiosComponent
      }, */
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreDespachoRoutingModule { }
