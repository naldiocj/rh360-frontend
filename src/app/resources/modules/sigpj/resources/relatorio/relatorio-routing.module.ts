
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { LayoutComponent } from '../../layout/layout.component'; 
import { GeralModule} from "./geral/geral.module" 
import { PersonalizadoModule } from "./personalisado/personalizado.module" 

// import { PiipsComponent } from './piips.component';

const routes: Routes = [
  {
    path: '',
    // redirectTo: 'registar-ou-editar',
    // canActivate: [AuthGuard],
    // component: LayoutComponent, 
    children: [
     
      {
        path: 'geral',
        data: {
          breadcrumb: 'Relatorios Gerais',
        },
        loadChildren: () =>
          import(
            './geral/geral.module'
          ).then((m) => m.GeralModule)
      },
      {
        path: 'personalizado',
        data: {
          breadcrumb: 'Relatorios Personalizados',
        },
        loadChildren: () =>
          import(
            './personalisado/personalizado.module'
          ).then((m) => m.PersonalizadoModule)
      },
    ]

  }
];

@NgModule({
  // imports: [RouterModule.forChild(routes, { preloadingStrategy: PreloadAllModules })],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelatorioRoutingModule { }


