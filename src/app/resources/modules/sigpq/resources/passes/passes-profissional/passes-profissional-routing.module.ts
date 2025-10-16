import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './listar/listar.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { AgentesComponent } from './agentes/agentes.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'listar',
    pathMatch: 'full'
  }, {
    path: 'listar',
    component: ListarComponent,
    canActivate: [AuthGuard]
  },{
    path: 'agentes',
    component: AgentesComponent,
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PassesProfissionalRoutingModule { }
