import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { RegistarGuard } from '@resources/modules/sigv-version2/core/guards/registar.guard';
import { RegistarComponent } from './registar/registar.component';
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
        {
          path: 'layout',
          component: LayoutComponent
        },
        {
          path: 'registar',
          canDeactivate: [RegistarGuard],
          component: RegistarComponent
        },
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
export class IndividualRoutingModule { }
