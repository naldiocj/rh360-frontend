import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { ListarExpedientesComponent } from './listar-expedientes/listar-expedientes.component';
import { ExpedientesComponent } from './expedientes.component';
import { DespachosComponent } from './despacho/despachos/despachos.component';
import { DetalhesDespachoComponent } from './despacho/detalhes-despacho/detalhes-despacho.component';


const routes: Routes = [
 
      {
        path: '',
        data: {
          breadcrumb: 'Listagem',
        },
        component: ListarExpedientesComponent
      },
      {
        path: 'despachos',
        data: { breadcrumb: 'Despachos' },
        children: [
          { path: '', component: DespachosComponent },
          { 
            path: 'detalhes/:id', 
            data: { breadcrumb: 'Detalhes' },  // <-- Añade breadcrumb
            component: DetalhesDespachoComponent 
          }
        ]
      }
 
   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpedientesRoutingModule { }
