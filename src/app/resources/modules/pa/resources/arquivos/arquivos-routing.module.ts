import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './listar/listar.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { ListarProcessoIndividualComponent } from './listar-processo-individual/listar-processo-individual.component';
import { ListarAgregadoFamiliarComponent } from './listar-Agregado-Familiar/listar-Agregado-Familiar.component';
import { FormacoesComponent } from './formacoes/formacoes.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'listar',
    pathMatch: 'full'
  },
  {
    canActivate: [AuthGuard],
    data: {
      creadcrumb: 'Arquivos-Data'
    },
    path: 'listar',
    component: ListarComponent
  },
  {
    canActivate: [AuthGuard],
    data: {
      creadcrumb: 'Arquivos-Data'
    },
    path: 'listar-formacoes',
    component: FormacoesComponent
  },{
    canActivate: [AuthGuard],
    data: {
      creadcrumb: 'Arquivos-Data'
    },
    path: 'listar-processo-individual',
    component: ListarProcessoIndividualComponent
  },
  {
    canActivate: [AuthGuard],
    data: {
      creadcrumb: 'Arquivos-Data'
    },
    path: 'listar-agregado-familiar',
    component: ListarAgregadoFamiliarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArquivosRoutingModule { }
