import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PainelConfiguracaoExtraComponent } from './painel-configuracao-extra/painel-configuracao-extra.component';

const routes: Routes = [

  {
    path: '',
    component: PainelConfiguracaoExtraComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutrasRoutingModule { }
