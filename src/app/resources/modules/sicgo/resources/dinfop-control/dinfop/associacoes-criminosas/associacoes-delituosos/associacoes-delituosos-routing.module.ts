
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarAssociacaoDelituosaComponent } from './listar-associacao-delituosa/listar-associacao-delituosa.component';
import { VerAssociacaoDelituosaComponent } from './ver-associacao-delituosa/ver-associacao-delituosa.component';

const routes: Routes = [


      {
        path: '',
        data: {
          breadcrumb: 'Associação de Delituoso',
        },
        component:ListarAssociacaoDelituosaComponent
      },

      {
        path: 'id:/associacao-delituosa',
        data: {
          breadcrumb: 'Associação de Delituoso',
        },
        component:VerAssociacaoDelituosaComponent
      },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssociacoesDelituososRoutingModule { }
