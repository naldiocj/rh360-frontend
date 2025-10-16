import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnviadaComponent } from './listar/enviada/enviada.component';
import { RecebidaComponent } from './listar/recebida/recebida.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { VerUmComponent } from './ver-um/ver-um.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'enviadas',
        component: EnviadaComponent,
      },
      {
        path: 'recebidas',
        component: RecebidaComponent,
      },
    ],
  },
  {
    path: 'ver-um',
    loadChildren: ()=>import('../gestao-correspondencia/ver-um/ver-um.module').then((m)=>m.VerUmModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestaoCorrespondenciaRoutingModule {}
