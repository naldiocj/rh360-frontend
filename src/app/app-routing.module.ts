import { NgModule } from '@angular/core';
import { LoginComponent } from '@resources/login/login.component';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// import { PerfilComponent } from '@resources/prerfil/perfil.component';
// import { DefinicoesComponent } from '@resources/definicoes/definicoes.component';
import { Error403Component } from '@resources/error/error403/error403.component';
import { Error404Component } from '@resources/error/error404/error404.component';
import { PaginaRestritaComponent } from '@resources/error/pagina-restrita/pagina-restrita.component';
import { AuthGuard } from '@core/guards/auth.guard';



export const routes: Routes = [
  {
    path: '',
    // redirectTo: 'piips',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '403',
    component: Error403Component,
    data: {
      title: 'Página 403',
    },
  },
  {
    path: '404',
    component: Error404Component,
    data: {
      title: 'Página 404',
    },
  },
  {
    path: '500',
    component: Error403Component,
    data: {
      title: 'Página 500',
    },
  },
  {
    path: 'conteudo-restrito',
    data: {
      title: 'Página que informa que o Conteúdo Restrição'
    },
    component: PaginaRestritaComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Pagina de Login',
    },
  },
  /* Rota inválida - comentada para diagnóstico
  {
    path: 'perfil',
    // component: PerfilComponent,
    data: {
      title: 'Perfil',
    },
  },
  */
  /* Rota inválida - comentada para diagnóstico
  {
    path: 'definicoes',
    // component: DefinicoesComponent,
    data: {
      title: 'Definições',
    },
  },
  */
  {
    path: 'piips',
    canActivate: [AuthGuard], // Reativado para garantir autenticação
    data: {
      breadcrumb: 'piips',
    },
    loadChildren: () =>
      import('./resources/piips/piips.module').then((m) => m.PiipsModule),
  },
  // {
  //   path: 'recuperar-senha/:token',
  //   component: RecuperarSenhaComponent,
  //   data: {
  //     title: 'Pedir nova senha',
  //   },
  // },
  // {
  //   path: '',
  //   component: DefaultLayoutComponent,
  //   data: {
  //     breadcrumb: 'Home',
  //   },
  //   children: [
  //     {
  //       path: 'dashboard',
  //       data: {
  //         breadcrumb: 'Dashboard',
  //       },
  //       loadChildren: () =>
  //         import('./resources/components/dashboard/dashboard.module').then(
  //           (m) => m.DashboardModule
  //         ),
  //     },
  //     {
  //       data: {
  //         breadcrumb: 'Templates',
  //       },
  //       path: 'templates',
  //       loadChildren: () =>
  //         import('./resources/components/template/templates.module').then(
  //           (m) => m.TemplatesModule
  //         ),
  //     },
  //     {
  //       data: {
  //         breadcrumb: 'Questionários',
  //       },
  //       path: 'questionnaires',
  //       loadChildren: () =>
  //         import('./resources/module/questionnaire/questionnaire.module').then(
  //           (m) => m.QuestionnaireModule
  //         ),
  //     },
  //     {
  //       data: {
  //         breadcrumb: 'Relatórios',
  //       },
  //       path: 'reports',
  //       loadChildren: () =>
  //         import('./resources/components/report/report.module').then(
  //           (m) => m.ReportModule
  //         ),
  //     },
  //     {
  //       data: {
  //         breadcrumb: 'Grupo',
  //       },
  //       path: 'grupos',
  //       loadChildren: () =>
  //         import('./resources/components/group/group.module').then(
  //           (m) => m.GroupModule
  //         ),
  //     },
  //     {
  //       path: 'organismos',
  //       data: {
  //         breadcrumb: 'Organismos',
  //       },
  //       loadChildren: () =>
  //         import('./resources/components/organismo/organismos.module').then(
  //           (m) => m.OrganismosModule
  //         ),
  //     },
  //     {
  //       path: 'logs',
  //       data: {
  //         breadcrumb: 'Logs',
  //       },
  //       loadChildren: () =>
  //         import('./resources/components/logs/logs.module').then(
  //           (m) => m.LogsModule
  //         ),
  //     },
  //     {
  //       data: {
  //         breadcrumb: 'notificações',
  //       },
  //       path: 'notificacoes',
  //       loadChildren: () =>
  //         import(
  //           './resources/components/Notificacao/notificacao.module'
  //         ).then((m) => m.NotificationsModule),
  //     }
  //     , {
  //       path: 'mobile',
  //       data: {
  //         breadcrumb: 'Mobile',
  //       },
  //       loadChildren: () =>
  //         import(
  //           './resources/module/mobile/components/mobile.module'
  //         ).then((m) => m.MobileModule),
  //     },
  //     {
  //       path: 'high-level-dashboard',
  //       data: {
  //         breadcrumb: 'Dashboard de Auto Nivel',
  //       },
  //       loadChildren: () =>
  //         import(
  //           './resources/module/high-level-dashboard/high-level-dashboard.module'
  //         ).then((m) => m.HighLevelDashboardModule),
  //     },
  //     {
  //       path: 'management-umapeid',
  //       data: {
  //         breadcrumb: 'Gerir Umape ID',
  //       },
  //       loadChildren: () =>
  //         import(
  //           './resources/module/management-umapeID/management-umape-id.module'
  //         ).then((m) => m.ManagementUmapeIDModule),
  //     },
  //     {
  //       path: 'portal',
  //       data: {
  //         breadcrumb: 'Portal',
  //       },
  //       loadChildren: () =>
  //         import(
  //           './resources/module/portal/components/portal.module'
  //         ).then((m) => m.PortalModule),
  //     },
  //     {
  //       path: 'archives',
  //       data: {
  //         breadcrumb: 'Gestão de arquivos',
  //       },
  //       loadChildren: () =>
  //         import(
  //           './resources/module/files-manager-archives/files-manager-archives.module'
  //         ).then((m) => m.FilesManagerArchivesModule),
  //     },
  //     {
  //       path: 'configs',
  //       data: {
  //         breadcrumb: 'Configurações',
  //       },
  //       children: [
  //         {
  //           path: 'acl',
  //           data: {
  //             breadcrumb: null,
  //           },
  //           children: [
  //             {
  //               data: {
  //                 breadcrumb: 'Utilizadores',
  //               },
  //               path: 'utilizadores',
  //               loadChildren: () =>
  //                 import(
  //                   './resources/components/configs/acl/utilizador/utilizador.module'
  //                 ).then((m) => m.UtilizadorModule),
  //             },
  //             {
  //               data: {
  //                 breadcrumb: 'Perfis',
  //               },
  //               path: 'perfis',
  //               loadChildren: () =>
  //                 import(
  //                   './resources/components/configs/acl/perfil/perfil.module'
  //                 ).then((m) => m.PerfilModule),
  //             },
  //             {
  //               data: {
  //                 breadcrumb: 'Permissões',
  //               },
  //               path: 'permissoes',
  //               loadChildren: () =>
  //                 import(
  //                   './resources/components/configs/acl/permissao/permissao.module'
  //                 ).then((m) => m.PermissionModule),
  //             },
  //           ],
  //         },
  //         {
  //           data: {
  //             breadcrumb: 'Menu',
  //           },
  //           path: 'menu',
  //           loadChildren: () =>
  //             import(
  //               './resources/components/configs/menu-navegacao/menu.module'
  //             ).then((m) => m.MenuModule),
  //         },
  //         {
  //           data: {
  //             breadcrumb: 'Dashboards',
  //           },
  //           path: 'menuprincipal',
  //           loadChildren: () =>
  //             import(
  //               './resources/components/configs/menu-principal/menu-principal.module'
  //             ).then((m) => m.MenuPrincipalModule),
  //         },
  //         {
  //           data: {
  //             breadcrumb: 'Tipos de campos',
  //           },
  //           path: 'campos/tipos',
  //           loadChildren: () =>
  //             import(
  //               './resources/components/configs/campos-tipos/campos-tipos.module'
  //             ).then((m) => m.CamposTipos),
  //         },
  //         {
  //           data: {
  //             breadcrumb: 'Aplicação',
  //           },
  //           path: 'aplicacao',
  //           component: SetupComponent,
  //         },
  //         {
  //           data: {
  //             breadcrumb: 'Marketplace',
  //           },
  //           path: 'marketplace',
  //           loadChildren: () =>
  //             import(
  //               './resources/components/configs/marketplace/marketplace.module'
  //             ).then((m) => m.MarketplaceModule),
  //         },
  //         {
  //           data: {
  //             breadcrumb: 'Campo Unidade',
  //           },
  //           path: 'unidades',
  //           loadChildren: () =>
  //             import(
  //               './resources/components/configs/menu-unidade/menu-unidade.module'
  //             ).then((m) => m.MenuUnidadeModule),
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   path: 'addons',
  //   component: DefaultLayoutComponent,
  //   children: [
  //     {
  //       path: 'projects',
  //       loadChildren: () =>
  //         import('./resources/module/manager-projects/manage-projects.module').then(
  //           (m) => m.ManageProjectsModule
  //         ),
  //     },
  //   ],
  // },
  { path: '**', component: Error404Component },
];
// @NgModule({
//   imports: [
//     RouterModule.forRoot(routes, {
//       preloadingStrategy: PreloadAllModules,
//       scrollPositionRestoration: 'enabled',
//     }),
//   ],
//   exports: [RouterModule],
// })

@NgModule({
  // imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}