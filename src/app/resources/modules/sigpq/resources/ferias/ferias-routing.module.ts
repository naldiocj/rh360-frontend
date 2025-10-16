
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { PlanificarLicencaComponent } from '../licencas/planificar-licenca/planificar-licenca.component';
import { AnalisarLicencaComponent } from '../licencas/analisar-licenca/analisar-licenca.component';
const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path:'visualizar-ferias-dos-agentes',component:AnalisarLicencaComponent,
        data: { informacao: 'visualizar',local:'feria' }
      },
        {
          path:'planificar-ferias',component:PlanificarLicencaComponent,
          data: { informacao: 'planificar',local:'feria' }
        },
        {
          path:'analisar-ferias',component:AnalisarLicencaComponent,
          data: { informacao: 'analisar',local:'feria' }
        },{
          path:'rejeitar-ferias-aprovada',component:AnalisarLicencaComponent,
          data: { informacao: 'rejeitar',local:'feria' }
        }
    ]

  }
];

@NgModule({
  // imports: [RouterModule.forChild(routes, { preloadingStrategy: PreloadAllModules })],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeriasRoutingModule { }

