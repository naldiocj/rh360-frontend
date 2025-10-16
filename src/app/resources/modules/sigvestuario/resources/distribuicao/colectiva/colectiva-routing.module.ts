import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { ListarComponent } from './listar/listar.component';
import { ListarMeiosComponent } from './listar-meios/listar-meios.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'listar',
    pathMatch: 'full'
  },

  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      /* {
        path: 'layout',
        component: LayoutComponent
      }, */
      /* {
        path: 'registar',
        canDeactivate: [RegistarGuard],
        component: RegistarComponent
      }, */
      {
        path: 'listar',
        component: ListarComponent
      },
      {
        path: 'listar/:id',
        component: ListarMeiosComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ColectivaRoutingModule { }
