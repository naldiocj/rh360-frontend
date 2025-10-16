
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { PiipsComponent } from './piips.component';

const routes: Routes = [
  {
    path: '',
    component: PiipsComponent,
    canActivate: [AuthGuard], // Reativado para teste
  },
  // ...createRoute
]

routes.push({
  path: 'sigpg',
  data: {
    breadcrumb: 'sigpg',
  },
  loadChildren: () =>
    import(
      '../modules/sigpq/sigpq.module'
    ).then((m) => m.SigpqModule),
  },
  // {
  //   path: 'sigt',
  //   data: [
  //     { breadcrumb: 'sigt' }
  //   ],
  //   loadChildren: () =>
  //     import(
  //       '../modules/sigt/sigt.module'
  //     ).then((m) => m.SigtModule),
  // },
  // {
  //   path: 'sigps',
  //   data: [
  //     { breadcrumb: 'SIGPS' }
  //   ],
  //   loadChildren: () =>
  //     import(
  //       '../modules/sigps/sigps.module'
  //     ).then(m=>m.SigpsModule)
  // },
  // {
  //   path: 'sigef',
  //   data: [
  //     { breadcrumb: 'sigef' }
  //   ],
  //   loadChildren: () =>
  //     import(
  //       '../modules/sigef/sigef.module'
  //     ).then((m) => m.SigefModule),
  // },
  // {
  //   path: 'sigae',
  //   data: [
  //     { breadcrumb: 'sigae' }
  //   ],
  //   loadChildren: () =>
  //     import(
  //       '../modules/sigae/sigae.module'
  //     ).then((m) => m.SigaeModule),
  // },
  // {
  //   path: 'pa',
  //   data: {
  //     breadcrumb: 'pa',
  //   },
  //   loadChildren: () =>
  //     import(
  //       '../modules/pa/pa.module'
  //     ).then((m) => m.PaModule),
  // },
  // {
  //   path: 'sigpj',
  //   data: {
  //     breadcrumb: 'sigpj',
  //   },
  //   loadChildren: () =>
  //     import(
  //       '../modules/sigpj/sigpj.module'
  //     ).then((m) => m.SigpjModule),
  // },
  // {
  //   path: 'sigiac',
  //   data: {
  //     breadcrumb: 'sigiac',
  //   },
  //   loadChildren: () =>
  //     import(
  //       '../modules/sigiac/sigiac.module'
  //     ).then((m) => m.SigiacModule),
  // },

  // {
  //   path: 'sigae',
  //   data: {
  //     breadcrumb: 'sigae',
  //   },
  //   loadChildren: () =>
  //     import(
  //       '../modules/sigae/sigae.module'
  //     ).then((m) => m.SigaeModule),
  // },

  // {
  //   path: 'porpna',
  //   data: {
  //     breadcrumb: 'PORPNA'
  //   },
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('../modules/porpna/porpna.module').then((m) => m.PorpnaModule),
  // },
  // {
  //   path: 'sigop',
  //   data: {
  //     breadcrumb: 'SIGOP'
  //   },
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('../modules/sicgo/sicgo.module').then((m) => m.SicgoModule),

  // },
  // {
  //   path: 'sigio',
  //   data: {
  //     breadcrumb: 'SIGIO'
  //   },
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('../modules/sigio/sigio.module').then((m) => m.SigiogModule),
  // },
  // {
  //   path: 'sigcod',
  //   data: {
  //     breadcrumb: 'SIGCOD'
  //   },
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('../modules/sigcode/sigcode.module').then((m) => m.SigcodeModule),
  // },
  //  {
  //    path: 'sigdoc',
  //    data: {
  //      breadcrumb: 'SIGDOC'
  //    },
  //    canActivate: [AuthGuard],
  //    loadChildren: () => import('../modules/sigdoc/sigdoc.module').then((m) => m.SigdocModule),
  //  },
  // {
  //   path: 'ep',
  //   data: {
  //     breadcrumb: 'EP'
  //   },
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('../modules/ep/ep.module').then((m) => m.EpModule),
  // },


  // //Adicionando modulos nas rotas
  // {
  //   path: 'sigoe',
  //   data: {
  //     breadcrumb: 'SIGOE'
  //   },
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('../modules/sigoe/sige-v2.module').then((m) => m.SigeV2Module),
  // },
  // {
  //   path: 'sigm',
  //   data: {
  //     breadcrumb: 'SIGM'
  //   },
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('../modules/sigm/sigm.module').then((m) => m.SigmModule),
  // },
  // /* Viveres */
  // {
  //   path: 'sigv',
  //   data: [
  //     { breadcrumb:  'sigv' }
  //   ],
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('../modules/sigv-version2/sigv-version2.module')
  //   .then((m) => m.SigvVersion2Module),
  // },
  // /* Vestuario */
  // {
  //   path: 'sigvest',
  //   data: [
  //     { breadcrumb: 'sigvest' }
  //   ],
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import ('../modules/sigvestuario/sigvestuario.module')
  //   .then((m) =>  m.SigvestuarioModule),

  // },
  // /* modulos provisórios de novas telas */
  // {
  //   path: 'siglog',
  //   data: [
  //     { breadcrumb:  'siglog' }
  //   ],
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import(
  //     '../modules/piips-telas/siglog-tela/siglog-tela.module'
  //   ).then((m) => m.SiglogTelaModule),
  // },
  // {
  //   path: 'siip',
  //   data: [
  //     { breadcrumb:  'siip' }
  //   ],
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import(
  //     '../modules/piips-telas/sigip-tela/sigip-tela.module'
  //   ).then((m) => m.SigipTelaModule),
  // },
  // {
  //   path: 'sigti',
  //   data: [
  //     { breadcrumb:  'sigti' }
  //   ],
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import(
  //     '../modules/piips-telas/sigti-tela/sigti-tela.module'
  //   ).then((m) => m.SigtiTelaModule),
  // },
  // {
  //   path: 'sicgo',
  //   data:{ breadcrumb:  'Sicgo' },
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('../modules/sicgo/sicgo.module').then((m) => m.SicgoModule),

  // },
   /* Fim */
)


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PiipsRoutingModule { }
