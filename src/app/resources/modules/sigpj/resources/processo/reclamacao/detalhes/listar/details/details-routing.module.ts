
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';  
import { DetailsComponent } from './details.component';
 
const routes: Routes = [
  {
    path: ':id',
    data: {
      breadcrumb: 'Listagem de historico',
    },
    component:DetailsComponent
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsRoutingModule { }
