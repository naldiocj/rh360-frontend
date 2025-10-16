import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './listar/listar.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { VisualizarComponent } from './visualizar/visualizar.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'listar', pathMatch: 'full'
  }, {
    path: 'listar',
    component: ListarComponent,
    canActivate: [AuthGuard]
  },{
    path: 'ver-um',
    component: VisualizarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidatoRoutingModule { }
