
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { DashboardComponent } from './dashboard.component';
import { TelaAntigaComponent } from './tela-antiga/tela-antiga.component';
import { TelaPrincipalComponent } from './tela-principal/tela-principal.component';
import { EfectivoEspecialComponent } from './efectivo-especial/efectivo-especial.component';
import { EfectivoGeralComponent } from './efectivo-geral/efectivo-geral.component';
import { TelaEspecialComponent } from './tela-especial/tela-especial.component';
const routes: Routes = [
  {
    path: '',
    component:DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      //{path:'',component:TelaEspecialComponent}
      {path:'',component:TelaPrincipalComponent}
      ,{path:'efectivo-especial-activo',component:EfectivoEspecialComponent,data: { informacao: 'activo'}}
      ,{path:'efectivo-especial-passivo',component:EfectivoEspecialComponent,data: { informacao: 'passivo'}}
      ,{path:'efectivo-especial-inactivo',component:EfectivoEspecialComponent,data: { informacao: 'inactivo'}}
      ,{path:'efectivo-geral-activo',component:EfectivoGeralComponent,data: { informacao: 'activo'}}
      ,{path:'efectivo-geral-passivo',component:EfectivoGeralComponent,data: { informacao: 'passivo'}}
      ,{path:'efectivo-geral-inactivo',component:EfectivoGeralComponent,data: { informacao: 'inactivo'}}
    ]

  }
];

@NgModule({
  // imports: [RouterModule.forChild(routes, { preloadingStrategy: PreloadAllModules })],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashBoardSigpqRoutingModule { }

