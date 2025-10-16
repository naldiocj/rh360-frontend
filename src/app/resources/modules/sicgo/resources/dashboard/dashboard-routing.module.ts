import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
 import { AuthGuard } from '@core/guards/auth.guard';
import { DashboardSicgoOcorrenciaComponent } from './dashboard-sicgo-ocorrencia/dashboard-sicgo-ocorrencia.component';
import { DashboardSicgoDinfopComponent } from './dashboard-sicgo-dinfop/dashboard-sicgo-dinfop.component';
 
const routes: Routes = [
  {
    path: '',
     children: [
      {
        path: '',
        component: DashboardSicgoOcorrenciaComponent,
        canActivate: [AuthGuard],
      }, 
      {
        path: 'painel-dinfop',
        component: DashboardSicgoDinfopComponent,
        canActivate: [AuthGuard],
        
        data: { breadcrumb: 'Dinfop' },
      },
     
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
