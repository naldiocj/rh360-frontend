
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';   
import { PermissionComponent } from './permission.component';

const routes: Routes = [
  {
    path: '',
    children: [ 
      {
        path: ':id',
        data: {
          breadcrumb: 'ID do utilizador',
        },
        component: PermissionComponent
      },
      
    ]
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermissionRoutingModule { }
