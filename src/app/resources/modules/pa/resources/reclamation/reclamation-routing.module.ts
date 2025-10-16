import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { ListReclamationComponent } from './resources/list-reclamation/list-reclamation.component';
import { SendReclamationComponent } from './resources/send-reclamation/send-reclamation.component';

export const routes: Routes = [
  {
    path: '', redirectTo: 'list', pathMatch: 'full'
  },
  {
    canActivate: [AuthGuard],
    path: '',
    data: {
      breadcrumb: 'PA'
    },
      children: [
        {
          path: 'list',
          data: {
            breadcrumb: "Reclamation List"
          },
          component: ListReclamationComponent
        },
        {
          path: 'send',
          data: {
            breadcrumb: "Reclamation Sended"
          },
          component: SendReclamationComponent
        }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReclamationRoutingModule { }
