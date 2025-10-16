
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { AnalisarPontualidadeComponent } from './analisar-pontualidade/analisar-pontualidade.component';
import { PlanificarPontualidadeComponent } from './planificar-pontualidade/planificar-pontualidade.component';
const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path:'analisar',component:AnalisarPontualidadeComponent,
        data: { informacao: 'planejar' }
      },{
        path:'gerenciar',component:PlanificarPontualidadeComponent,
        data: { informacao: 'planejar' }
      }/* ,
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
        } */
    ]

  }
];

@NgModule({
  // imports: [RouterModule.forChild(routes, { preloadingStrategy: PreloadAllModules })],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PontualidadeRoutingModule { }


