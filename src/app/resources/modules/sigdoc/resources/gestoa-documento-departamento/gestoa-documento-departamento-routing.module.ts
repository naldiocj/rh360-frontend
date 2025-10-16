import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { ListarComponent } from './listar/listar.component';

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
    loadChildren: ()=>import('./ver-um/ver-um-departamento.module').then((m)=>m.VerUmModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestaoDocumentoDepartamentoRoutingModule {}
