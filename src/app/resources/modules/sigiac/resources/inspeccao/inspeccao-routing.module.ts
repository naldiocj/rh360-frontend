
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';   

const routes: Routes = [
  {
    path: '',
    children: [  
      {
        path: 'averiguacao',
        data: {
          breadcrumb: 'Averiguação',
        },
        loadChildren: () =>
          import(
            './averiguacao/averiguacao.module'
          ).then((m) => m.AveriguacaoModule)
      },
      {
        path: 'auditoria',
        data: {
          breadcrumb: 'detalhes do Processo Disciplinar',
        },
        loadChildren: () =>
          import(
            './auditorias/auditoria.module'
          ).then((m) => m.AuditoriaModule)
      }
    ]
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InspeccaoRoutingModule { }
