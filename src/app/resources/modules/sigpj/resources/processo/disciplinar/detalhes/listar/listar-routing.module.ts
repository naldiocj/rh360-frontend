
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { ListarComponent } from './listar.component';

const routes: Routes = [
  {
    path: ':id',
    data: {
      breadcrumb: 'Listagem de detalhes',
    },
    component: ListarComponent
  },
  {
    path: 'parecer',
    data: {
      breadcrumb: 'Parecer de Intervenientes',
    },
    loadChildren: () =>
      import(
        './parecer/parecer.module'
      ).then((m) => m.ParecerModule)
  },
  {
    path: 'decisao',
    data: {
      breadcrumb: 'Decisao de Intervenientes',
    },
    loadChildren: () =>
      import(
        './decisao/decisao.module'
      ).then((m) => m.DecisaoModule)
  },

  {
    path:'visualizar',
    data:{
      breadcrumb:'Visualizar mais detalhes do Interveniente'
    },
    loadChildren:()=>
      import(
        './details/details.module'
      ).then((m)=> m.DetailsModule)
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarRoutingModule { }
