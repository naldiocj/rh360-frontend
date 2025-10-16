
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';  
import { ListarComponent } from './listar/listar.component'; 
import {RegistarOuEditarComponent} from "./registar-ou-editar/registar-ou-editar.component"
import { GerarPdfComponent } from './gerar-pdf/gerar-pdf.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'listagem',
        data: {
          breadcrumb: 'Listagem',
        },
        component: ListarComponent
      },
      {
        path: 'registar-ou-ediar',
        data: {
          breadcrumb: 'Registro',
        },
        component: RegistarOuEditarComponent
      },
      {
        path: 'gerar-pdf',
        data: {
          breadcrumb: 'gerar pdf',
        },
        component: GerarPdfComponent
      }
    ]
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalizadoRoutingModule { }
