import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { PanelControloComponent } from './resources/panel-controlo/panel-controlo.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'panel-controlo',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'panel-controlo',
        component: PanelControloComponent,
      },
      {
        path: 'entrada-expediente',
        loadChildren: () =>
          import('./resources/entrada-expediente/entrada-expediente.module').then(
            (m) => m.EntradaexpedienteModule
          ),
      },
      {
        path: 'tramitacao-expediente',
        loadChildren: () =>
          import('./resources/tramitacao-expediente/tramitacao-expediente.module').then(
            (m) => m.TramitacaoExpedienteModule
          ),
      },
      {
        path: 'gestao-correspondencia',
        loadChildren: () =>
          import('./resources/gestao-correspondencia/gestao-correspondencia.module').then(
            (m) => m.GestaCorrrespondenciaModule
          ),
      },
      {
        path: 'gestao-documento-direcao',
        loadChildren: () =>
          import('./resources/gestao-documento-direcao/gestao-documento-direcao.module').then(
            (m) => m.GestaoDocumentoDirecaoModule
          ),
      },
      {
        path: 'gestoa-documento-departamento',
        loadChildren: () =>
          import('./resources/gestoa-documento-departamento/gestoa-documento-departamento.module').then(
            (m) => m.GestaoDocumentoDepartamentoModule
          ),
      },
      {
        path: 'gestoa-documento-seccao',
        loadChildren: () =>
          import('./resources/gestoa-documento-seccao/gestoa-documento-seccao.module').then(
            (m) => m.GestaoDocumentoSeccaoModule
          ),
      },
      {
        path: 'criar-documento',
        loadChildren: () =>
          import('./resources/criar-documento/criar-documento.module').then(
            (m) => m.CriarDocumentoModule
          ),
      },
      {
        path: 'arquivos',
        loadChildren: () =>
          import('./resources/arquivos/arquivos.module').then(
            (m) => m.ArquivosModule
          ),
      },
      {
        path: 'arquivos-orgao',
        loadChildren: () =>
          import('./resources/arquivos-orgao/arquivos-orgao.module').then(
            (m) => m.ArquivosOrgaoModule
          ),
      },
      {
        path: 'tipo-documento',
        loadChildren: () =>
          import('./resources/tipo-documento/tipo-documento.module').then(
            (m) => m.TipoDocumentoModule
          ),
      },
      {
        path: 'tipo-natureza',
        loadChildren: () =>
          import('./resources/tipo-natureza/tipo-natureza.module').then(
            (m) => m.TipoNaturezaModule
          ),
      },
      {
        path: 'utilizador',
        loadChildren: () =>
          import('./resources/utilizador/utilizador.module').then(
            (m) => m.UtilizadorModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SigdocRoutingModule {}
