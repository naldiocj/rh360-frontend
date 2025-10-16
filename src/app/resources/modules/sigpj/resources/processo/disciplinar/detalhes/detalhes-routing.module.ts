
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalhesComponent } from './detalhes.component';
import { AuthGuard } from '@core/guards/auth.guard';


const routes: Routes = [
  {
    path: ':id',
    canActivate:[AuthGuard],
    data: {
      breadcrumb: 'Listagem de detalhes',
      permission:'disciplinar-detalhes-show'
    },
    component: DetalhesComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalhesRoutingModule { }
