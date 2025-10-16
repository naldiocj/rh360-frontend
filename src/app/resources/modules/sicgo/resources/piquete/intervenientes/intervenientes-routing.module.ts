import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
 
import { AuthGuard } from '@core/guards/auth.guard';
import { IntervenientesPainelComponent } from './intervenientes-painel/intervenientes-painel.component';
import { AcusadoComponent } from './acusado/acusado.component';
import { CondutorComponent } from './condutor/condutor.component';
import { DenunciaAnonimaComponent } from './denuncia-anonima/denuncia-anonima.component';
import { DenunciaPublicaComponent } from './denuncia-publica/denuncia-publica.component';
import { DetidosComponent } from './detidos/detidos.component';
import { InformantesComponent } from './informantes/informantes.component';
import { LesadosComponent } from './lesados/lesados.component';
import { OficialOperativoComponent } from './oficial-operativo/oficial-operativo.component';
import { ParticipantesComponent } from './participantes/participantes.component';
import { SubinformantesComponent } from './subinformantes/subinformantes.component';
 
const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Piquete' }, // Define um breadcrumb geral para o módulo
    children: [
       {
        path: '',
        component: IntervenientesPainelComponent
       },
      {
        path: 'vitimas',  
        data: { breadcrumb: 'Todos os Vítimas' },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./vitima/vitima.module').then((m) => m.VitimaModule),
      },
      {
        path: 'testemunhas',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./testemunha-ou-Intevenientes/testemunha-ou-intevenientes.module').then(
            (m) => m.TestemunhaOuIntevenientesModule
          ),
        data: { breadcrumb: 'Testemunhas e Intervenientes' },
      },
      {
        path: 'acusado',
        component: AcusadoComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Acusado' }
      },
      {
        path: 'condutor',
        component: CondutorComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Condutor' }
      },
      {
        path: 'denuncia-anonima',
        component: DenunciaAnonimaComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Denúncia Anônima' }
      },
      {
        path: 'denuncia-publica',
        component: DenunciaPublicaComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Denúncia Pública' }
      },
      {
        path: 'detidos',
        component: DetidosComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Detidos' }
      },
      {
        path: 'informantes',
        component: InformantesComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Informantes' }
      },
      {
        path: 'lesados',
        component: LesadosComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Lesados' }
      },
      {
        path: 'oficial-operativo',
        component: OficialOperativoComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Oficial Operativo' }
      },
      {
        path: 'participantes',
        component: ParticipantesComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Participantes' }
      },
      {
        path: 'subinformantes',
        component: SubinformantesComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Subinformantes' }
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class IntervenienteRoutingModule {}
