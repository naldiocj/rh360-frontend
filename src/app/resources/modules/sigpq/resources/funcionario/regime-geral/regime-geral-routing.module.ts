
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';  
import { ListarComponent } from './listar/listar.component';
// import { PiipsComponent } from './piips.component';

const routes: Routes = [
  {
    path: '',
    // component: LayoutComponent,
    // redirectTo: 'listagem',
    // canActivate: [AuthGuard], 
    children: [
      {
        path: 'listagem',
        data: {
          breadcrumb: 'Listagem',
        },
        component: ListarComponent
      },
      {
        path: 'create',
        data: {
          breadcrumb: 'Registar',
        },
        // component: CreateOrEditComponent
      },
    ]
  }
  // , {
  //   path: 'home',
  //   data: {
  //     breadcrumb: 'sigpg',
  //   },
  //   loadChildren: () =>
  //     import(
  //       './home/home.module'
  //     ).then((m) => m.HomeModule),

  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegimeGeralRoutingModule { }
