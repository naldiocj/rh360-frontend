import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContentComponent } from './components/main-content/main-content.component';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'siglog-projectos',
    pathMatch: 'full',
  },
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'SIGLOG-PROJECTOS',
    },
    children: [
      {
        path: 'siglog-projectos',
        data: {
          breadcrumb: 'SIGLOG-PROJECTOS',
        },
        component: MainContentComponent,
      },
      {
        path: 'sigv',
        data: [
          { breadcrumb:  'sigv' }
        ],
        loadChildren: () => import(
          '../../sigv-version2/sigv-version2.module'
        ).then((m) => m.SigvVersion2Module),
      },
      {
        path: 'sigvest',
        data: [
          { breadcrumb:  'sigvest' }
        ],
        loadChildren: () => import(
          '../../sigvestuario/sigvestuario.module'
        ).then((m) => m.SigvestuarioModule),
      },
    ]
  },
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiglogTelaRoutingModule { }
