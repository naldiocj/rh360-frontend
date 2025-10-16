import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [{
  path: 'bilhetes',
  loadChildren: () => import('./bilhete/bilhete.module').then((m) => m.BilheteModule),
  canActivate: [AuthGuard]
}, {
  path: 'certidao-militar',
  loadChildren: () => import('./certi-militar/certi-militar.module').then((m) => m.CertiMilitarModule),
  canActivate: [AuthGuard]
}, {
  path: 'certificado-habilitacao',
  loadChildren: () => import('./certi-habilitacao/certi-habilitacao.module').then((m) => m.CertiHabilitacaoModule),
  canActivate: [AuthGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentosRoutingModule { }
