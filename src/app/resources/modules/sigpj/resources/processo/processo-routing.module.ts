
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { LayoutComponent } from '../../layout/layout.component'; 
import { DisciplinarModule} from "./disciplinar/disciplinar.module"
import {ReclamacaoModule} from "./reclamacao/reclamacao.module"


// import { PiipsComponent } from './piips.component';

const routes: Routes = [
  {
    path: '',
    // redirectTo: 'registar-ou-editar',
    // canActivate: [AuthGuard],
    // component: LayoutComponent, 
    children: [
     
      {
        path: 'disciplinar',
        data: {
          breadcrumb: 'Disciplinar',
        },
        loadChildren: () =>
          import(
            './disciplinar/disciplinar.module'
          ).then((m) => m.DisciplinarModule)
      },
      {
        path: 'reclamacao',
        data: {
          breadcrumb: 'Reclamação',
        },
        loadChildren: () =>
          import(
            './reclamacao/reclamacao.module'
          ).then((m) => m.ReclamacaoModule)
      },
      {
        path: 'criminal',
        data: {
          breadcrumb: 'Criminal',
        },
        loadChildren: () =>
          import(
            './criminal/criminal.module'
          ).then((m) => m.CriminalModule)
      },
    ]

  }
];

@NgModule({
  // imports: [RouterModule.forChild(routes, { preloadingStrategy: PreloadAllModules })],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessoRoutingModule { }


