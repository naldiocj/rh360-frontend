import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaComponent } from './resources/lista/lista.component';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: "",
    redirectTo: "",
    pathMatch: "full",

    canActivate: [AuthGuard],

    children: [
      {
        path: '',
        component: ListaComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalibreRoutingModule { }
