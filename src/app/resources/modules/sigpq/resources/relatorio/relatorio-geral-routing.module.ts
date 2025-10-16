
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { RelatorioGeralComponent } from './relatorio-geral/relatorio-geral.component';
import { RelatorioLicencaComponent } from './relatorio-licenca/relatorio-licenca.component';
// import { LayoutComponent } from '../../layout/layout.component';
// import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
// import { PiipsComponent } from './piips.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'geral',
    pathMatch: 'full',
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'geral',
        data: {
          breadcrumb: 'Opções',
        },
        component: RelatorioGeralComponent
      },{
        path: 'licencas',
        data: {
          breadcrumb: 'Opções',
        },
        component: RelatorioLicencaComponent
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelatorioGeralRoutingModule { }
