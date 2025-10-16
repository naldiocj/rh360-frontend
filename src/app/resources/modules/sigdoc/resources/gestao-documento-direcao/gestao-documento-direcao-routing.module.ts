import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './listar/listar.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { VerUmDirecaoComponent } from './ver-um/ver-um-direcao.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'listar',
        component: ListarComponent,
      },
    ],
  },
  {
    path: 'ver-um',
    loadChildren: ()=>import('./ver-um/ver-um-direcao.module').then((m)=>m.VerUmModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestaoDocumentoDirecaoRoutingModule {}
