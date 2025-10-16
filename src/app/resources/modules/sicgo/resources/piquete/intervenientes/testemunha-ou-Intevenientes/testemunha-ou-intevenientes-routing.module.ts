
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { ListaTestemunhaComponent } from './lista/lista.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        data: {
          breadcrumb: 'Listagem',
        },
        component: ListaTestemunhaComponent
      },

    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestemunhaOuIntevenientesRoutingModule { }
