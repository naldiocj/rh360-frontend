import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContentComponent } from './components/main-content/main-content.component';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sigti-projectos',
    pathMatch: 'full',
  },
  {
    path: 'sigti-projectos',
    data: {
      breadcrumb: 'SIGTI-PROJECTOS',
    },
    component: MainContentComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SigtiTelaRoutingModule { }
