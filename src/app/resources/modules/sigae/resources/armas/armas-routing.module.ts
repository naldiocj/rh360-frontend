import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaComponent } from './resources/lista/lista.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { InformacaoArmaComponent } from '../informacao-arma/informacao-arma.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "",
    pathMatch: "full",

    canActivate: [AuthGuard],

    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ListaComponent,
      },
      {
        path: '/ver-detalhes/:id',
        canActivate: [AuthGuard],
        component: InformacaoArmaComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArmasRoutingModule { }
