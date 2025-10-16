
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarAssociacaoGruposComponent } from './listar-associacao-grupos/listar-associacao-grupos.component';
import { VerAssociacaoGruposComponent } from './ver-associacao-grupos/ver-associacao-grupos.component';

const routes: Routes = [


      {
        path: '',
        data: {
          breadcrumb: 'Associação de Delituoso',
        },
        component:ListarAssociacaoGruposComponent
      },

      {
        path: 'id:/detale-associacao-delituoso',
        data: {
          breadcrumb: 'Associação de Delituoso',
        },
        component:VerAssociacaoGruposComponent
      },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssociacoesGruposRoutingModule { }
