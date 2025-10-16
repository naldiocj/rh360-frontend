import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestInformacaoComponent } from './gest-informacao.component';
import { DetalhesInformanteComponent } from './detalhes-informante/detalhes-informante.component';
import { FontesInformacaoComponent } from './fontes-informacao/fontes-informacao.component';
import { InformantesComponent } from './informantes/informantes.component';
import { RegistarOuEditarComponent } from './registos/registar-ou-editar/registar-ou-editar.component';

 
const routes: Routes = [ 
  { path: 'novo', component: RegistarOuEditarComponent },
  { path: 'fontes-informacao', component: FontesInformacaoComponent },
  { path: 'informantes', component: InformantesComponent },
   { path: 'informantes/detalhes/:id', component: DetalhesInformanteComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestInformacaoRoutingModule { }
