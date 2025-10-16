import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from './config.component';
import { AuthGuard } from '@core/guards/auth.guard';

 
const routes: Routes = [
  {
    path: '',
    redirectTo: 'acl',
    pathMatch: 'full',
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: ConfigComponent,
    data: {
      breadcrumb: 'ACL',
    },
    children: [
      {
        path: 'acl',
        data: {
          breadcrumb: 'ACL',
        },
        canActivate: [AuthGuard]
        ,
        loadChildren: () =>
          import(
            './acl/acl.module'
          ).then((m) => m.AclModule)
      },
       
    ]
  }
];

@NgModule({
  // imports: [RouterModule.forChild(routes, { preloadingStrategy: PreloadAllModules })],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigRoutingModule { }
