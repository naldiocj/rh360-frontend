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
    loadChildren: ()=>import('../gestao-correspondencia/ver-um/ver-um.module').then((m)=>m.VerUmModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArquivosRoutingModule {}
