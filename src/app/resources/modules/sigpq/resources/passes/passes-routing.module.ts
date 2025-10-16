import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'profissional',
    pathMatch: 'full'
  },
  {
    path: 'profissional',
    canActivate: [AuthGuard],
    loadChildren: () => import('./passes-profissional/passes-profissional.module').then(m => m.PassesProfissionalModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PassesRoutingModule { }
