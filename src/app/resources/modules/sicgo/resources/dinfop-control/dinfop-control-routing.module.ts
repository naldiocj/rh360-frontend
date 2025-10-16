import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { DinfopComponent } from './dinfop/dinfop.component';
import { DelituosoDetalhesComponent } from './delituoso-detalhes/delituoso-detalhes.component';
 


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    
    data: { 
      breadcrumb: 'Dinfop',
      icon: 'bi-broadcast-pin',               // Ícone para mostrar junto ao breadcrumb
      roles: ['admin']
    },
    component: DinfopComponent,
    loadChildren: () =>
      import('./dinfop/dinfop.module').then((m) => m.DinfopModule),
  },
  {
    path: 'delituoso',
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Dinfop',
      data: { roles: ['admin', 'operador'] }, // Admin e operador podem acessar
    },
    component: DelituosoDetalhesComponent,
    loadChildren: () =>
      import('./delituoso-detalhes/delituoso-detalhes.module').then(
        (m) => m.DelituosoDetalhesModule
      ),
  },
];

 


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DinfopControlRoutingModule {}
