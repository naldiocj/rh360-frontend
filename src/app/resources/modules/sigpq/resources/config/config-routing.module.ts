import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'acl',
    pathMatch: 'full',
  },
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'ACL',
    },
    children: [
      {
        path: 'acl',
        data: {
          breadcrumb: 'ACL',
        },
        canActivate: [AuthGuard],
        loadChildren: () => import('./acl/acl.module').then((m) => m.AclModule),
      },
      {
        path: 'direcao-or-orgao',
        data: {
          breadcrumb: 'Direção ou Orgão',
        },
        canActivate: [AuthGuard],

        loadChildren: () =>
          import('./direcao-or-orgao/direcao-or-orgao.module').then(
            (m) => m.DirecaoOrOrgaoModule
          ),
      },
      {
        path: 'departamento',
        data: {
          breadcrumb: 'Departamento',
        },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./departamento/departamento.module').then(
            (m) => m.DepartamentoModule
          ),
      },
      {
        path: 'seccao',
        data: {
          breadcrumb: 'Secção',
        },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./seccao/seccao.module').then((m) => m.SeccaoModule),
      },
      {
        path: 'posto-policial',
        data: {
          breadcrumb: 'Unidade',
        },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./unidade/unidade.module').then((m) => m.UnidadeModule),
      },
      {
        path: 'provincias',
        data: {
          breadcrumb: 'Provincias',
        },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./provincias/provincias.module').then(
            (m) => m.ProvinciasModule
          ),
      },
      {
        path: 'municipio',
        data: {
          breadcrumb: 'Municipios',
        },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./municipio/municipio.module').then((m) => m.MunicipioModule),
      },
      {
        path: 'assinatura-digital',
        loadChildren: () =>
          import('./assinatura-digital/assinatura-digital.module').then(
            (m) => m.AssinaturaDigitalModule
          ),
      },
      {
        path: 'distrito',
        data: {
          breadcrumb: 'Distritos',
        },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./distrito/distrito.module').then((m) => m.DistritoModule),
      },
      {
        path: 'chefia-comando',
        data: {
          breachcrumb: 'Chefe-Comandante',
        },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./chefe-comandante/chefe-comandante.module').then(
            (m) => m.ChefeComandanteModule
          ),
      },
      {
        path: 'funcao-regime',
        data: {
          breachcrumb: 'Funcao-Regime',
        },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./funcao-regime/funcao-regime.module').then(
            (m) => m.FuncaoRegimeModule
          ),
      },
      {
        path: 'patentes',
        data: {
          breachcrumb: 'Patentes',
        },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./patentes/patentes.module').then((m) => m.PatentesModule),
      },
      {
        path: 'tipo-de-formacao',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Tipo de Formacao' },
        loadChildren: () =>
          import('./tipo-de-formacao/tipo-de-formacao.module').then(
            (m) => m.TipoDeFormacaoModule
          ),
      },
      {
        path: 'curso',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Curso' },
        loadChildren: () =>
          import('./curso/curso.module').then((m) => m.CursoModule),
      },
      {
        path: 'instituicao-de-ensino',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Instituição de Ensino' },
        loadChildren: () =>
          import('./instituicao-de-ensino/instituicao-de-ensino.module').then(
            (m) => m.InstituicaoDeEnsinoModule
          ),
      },
      {
        path: 'empresa',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Empresas' },
        loadChildren: () =>
          import('./empresas/empresas.module').then((m) => m.empresasModule),
      },
      {
        path: 'cargos',
        data: {
          breadcrumb: 'cargos',
        },
        loadChildren: () =>
          import('./cargos/cargos.module').then((m) => m.CargosModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'tipo-licencas',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'tipo-licencas' },
        loadChildren: () =>
          import('./tipo-licencas/tipo-licencas.module').then(
            (m) => m.TipoLicencaModule
          ),
      },
      {
        path: 'feriados',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'tipo-licencas' },
        loadChildren: () =>
          import('./feriados/feriados.module').then((m) => m.FeriadosModule),
      },
      {
        path: 'dias-de-restricoes-para-licencas',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'plano-licencas' },
        loadChildren: () =>
          import('./plano-licencas/plano-licencas.module').then(
            (m) => m.PlanoLicencaModule
          ),
      },
      {
        path: 'vagas-por-progressao',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'vagas-para-progressão' },
        loadChildren: () =>
          import('./vagas-por-promocao/vagas-por-promocao.module').then(
            (m) => m.VagaPromocaoModule
          ),
      },
    ],
  },
];

@NgModule({
  // imports: [RouterModule.forChild(routes, { preloadingStrategy: PreloadAllModules })],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigRoutingModule {}
