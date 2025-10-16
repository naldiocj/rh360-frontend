import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContentComponent } from './components/main-content/main-content.component';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sigip-projectos',
    pathMatch: 'full',
  },
  {
    path: 'sigip-projectos',
    data: {
      breadcrumb: 'SIGIP-PROJECTOS',
    },
    component: MainContentComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SigipTelaRoutingModule { }
