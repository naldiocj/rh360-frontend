import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContentComponent } from './components/main-content/main-content.component';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sicgop-projectos',
    pathMatch: 'full',
  },
  {
    path: 'sicgop-projectos',
    data: {
      breadcrumb: 'SICGOP-PROJECTOS',
    },
    component: MainContentComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SicgopTelaRoutingModule { }
