import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Routes, RouterModule } from '@angular/router';
import { SecretariaOcorrenciasComponent } from './secretaria-ocorrencias/secretaria-ocorrencias.component';
import { SecretariaComponent } from './secretaria.component';
import { SecretariaExpedientesComponent } from './secretaria-expedientes/secretaria-expedientes.component';


const routes: Routes = [
  {
    path: '',
    component: SecretariaComponent,
    children: [
      
      {
        path: 'expedientes',
        data: {
          breadcrumb: 'Expedientes',
        },
        component: SecretariaExpedientesComponent
      },
      {
        path: '',
        data: {
          breadcrumb: 'Ocorrencias',
        },
        component: SecretariaOcorrenciasComponent
      },
       
       
       
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecretariaRoutingModule { }
