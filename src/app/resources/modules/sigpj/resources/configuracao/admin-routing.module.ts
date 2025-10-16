
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { LayoutComponent } from '../../layout/layout.component';   


// import { PiipsComponent } from './piips.component';

const routes: Routes = [
  {
    path: '',
    // redirectTo: 'registar-ou-editar',
    // canActivate: [AuthGuard],
    // component: LayoutComponent, 
    children: [
      {
        path: 'perfil',
        data: {
          breadcrumb: 'Perfil',
        },
        loadChildren: () =>
          import(
            './perfil/perfil.module'
          ).then((m) => m.PerfilModule)
      }, 
      {
        path: 'utilizador',
        data: {
          breadcrumb: 'utilizador',
        },
        loadChildren: () =>
          import(
            './utilizador/utilizador.module'
          ).then((m) => m.UtilizadorModule)
      }
    ]

  }
];

@NgModule({
  // imports: [RouterModule.forChild(routes, { preloadingStrategy: PreloadAllModules })],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }


