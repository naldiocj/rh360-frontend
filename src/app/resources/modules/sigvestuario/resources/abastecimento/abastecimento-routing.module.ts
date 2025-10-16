import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';


const routes: Routes = [
  {
      path: '',
      redirectTo: 'layout',
      pathMatch: 'full'
    },
  
    {
      path: '',
      canActivate: [AuthGuard],
      children: [
        {
          path: 'layout',
          component: LayoutComponent
        },
        {
          path: 'fornecimento-minint',
          loadChildren : () => import('./fornecimento-minint/fornecimento-minint.module').then((m) => m.FornecimentoMinintModule)
        }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbastecimentoRoutingModule { }
