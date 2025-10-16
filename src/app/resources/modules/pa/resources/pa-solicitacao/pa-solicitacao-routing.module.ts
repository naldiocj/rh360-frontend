import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './listar/listar.component';
import { PendenteComponent } from './pendente/pendente.component';
import { HistoricoComponent } from './historico/historico.component';
import { LicencasComponent } from './licencas/licencas.component';

const routes: Routes = [
  {
    path: '', redirectTo: '', pathMatch: 'full'
  }, {
    path: 'listar',
    component: ListarComponent
  },
  {
    path: 'recebidas',
    component: PendenteComponent
  },
  {
    path: 'historico',
    component:HistoricoComponent
  },
  {
    path: 'licencas',
    component:LicencasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaSolicitacaoRoutingModule { }
