
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { PlanificarLicencaComponent } from './planificar-licenca/planificar-licenca.component';
import { AnalisarLicencaComponent } from './analisar-licenca/analisar-licenca.component';
const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path:'visualizar-licencas-dos-agentes',component:AnalisarLicencaComponent,
        data: { informacao: 'visualizar',local:'licenca' }
      },
        {
          path:'planificar-licenca',component:PlanificarLicencaComponent,
          data: { informacao: 'planificar',local:'licenca' }
        },
        {
          path:'analisar-licenca',component:AnalisarLicencaComponent,
          data: { informacao: 'analisar',local:'licenca' }
        },{
          path:'rejeitar-licenca-aprovada',component:AnalisarLicencaComponent,
          data: { informacao: 'rejeitar',local:'licenca' }
        },
        {
          path:'visualizar-faltas-dos-agentes',component:PlanificarLicencaComponent,
          data: { informacao: 'visualizar',local:'falta' }
        },
        {
          path:'atribuir-falta',component:PlanificarLicencaComponent,
          data: { informacao: 'planificar',local:'falta' }
        },
        {
          path:'analisar-falta',component:PlanificarLicencaComponent,
          data: { informacao: 'analisar',local:'falta' }
        },{
          path:'rejeitar-falta-aprovada',component:PlanificarLicencaComponent,
          data: { informacao: 'rejeitar',local:'falta' }
        }
    ]

  }
];

@NgModule({
  // imports: [RouterModule.forChild(routes, { preloadingStrategy: PreloadAllModules })],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LicencasRoutingModule { }


/* children: [ //MODELO
      {
        path:'visualizar-licencas-dos-agentes',component:PlanificarLicencaComponent,
        data: { informacao: 'visualizar',local:'licenca' }
      },
        {
          path:'planificar-licenca',component:PlanificarLicencaComponent,
          data: { informacao: 'planificar',local:'licenca' }
        },
        {
          path:'analisar-licenca',component:PlanificarLicencaComponent,
          data: { informacao: 'analisar',local:'licenca' }
        },{
          path:'rejeitar-licenca-aprovada',component:PlanificarLicencaComponent,
          data: { informacao: 'rejeitar',local:'licenca' }
        },
        {
          path:'visualizar-faltas-dos-agentes',component:PlanificarLicencaComponent,
          data: { informacao: 'visualizar',local:'falta' }
        },
        {
          path:'atribuir-falta',component:PlanificarLicencaComponent,
          data: { informacao: 'planificar',local:'falta' }
        },
        {
          path:'analisar-falta',component:PlanificarLicencaComponent,
          data: { informacao: 'analisar',local:'falta' }
        },{
          path:'rejeitar-falta-aprovada',component:PlanificarLicencaComponent,
          data: { informacao: 'rejeitar',local:'falta' }
        }
    ]
 */
