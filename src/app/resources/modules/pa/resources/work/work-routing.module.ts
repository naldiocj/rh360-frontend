import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { ListWorkComponent } from './resources/list-work/list-work.component';
import { NewWorkComponent } from './resources/new-work/new-work.component';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: 'new'
  },
  {
    canActivate: [AuthGuard],
    path: '',
    children: [
      {
        path: 'historic',
        component: ListWorkComponent,
        data: {
          breadcrumb: "Work List"
        }
      },
      {
        path: 'new',
        component: NewWorkComponent,
        data: {
          breadcrumb: NewWorkComponent
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkRoutingModule { }
