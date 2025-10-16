
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { ListarComponent } from './listar/listar.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { ForaDeEfetividadeComponent } from './fora-de-efetividade/fora-de-efetividade.component';
import { ListarParaPromocaoComponent } from './listar-para-promocao/listar-para-promocao.component';
import { ProtecaoSocialComponent } from './protecao-social/protecao-social.component';
import { ListarPassivoComponent } from './listar-passivos/listar-passivos.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'registar-ou-editar',
        data: {
          breadcrumb: 'Registar ou editar',
        },
        component: RegistarOuEditarComponent
      },
      {
        path: 'registar-ou-editar/mais-informacao/:info',
        data: {
          breadcrumb: 'Registar ou editar',
        },
        component: RegistarOuEditarComponent
      },
      {
        path: 'registar-ou-editar/:id',
        data: {
          breadcrumb: 'Registar ou editar',
        },
        component: RegistarOuEditarComponent
      },
      {
        path: 'listar',
        data: {
          breadcrumb: 'Listar',
        },
        component: ListarComponent
      },{
        path: 'listar-passivos',
        data: {
          breadcrumb: 'Listar-passivos',
        },
        component: ListarPassivoComponent
      },{
        path: 'propor-agente-execcao',
        data: {
          breadcrumb: 'Propor-agente-execcao',
        },
        component: ListarParaPromocaoComponent
      },{
        path: 'fora-de-atividade',
        data: {
          breadcrumb: 'Fora-de-atividade',
          type:{name:'fora-de-atividade',sigpq_excluir_estado_reforma_id:{reformado:8,falecido:9,demitido:10}} //No Back-End iremos retornar os efectivos fora de atividade excepto os que tivere nestes sigpq_excluir_estado_reforma_idq_estado_reforma_id
        },
        component: ForaDeEfetividadeComponent
      },{
        path: 'inactivo',
        data: {
          breadcrumb: 'Inactivo',
          type:{name:'Inactivo',sigpq_excluir_estado_reforma_id:{reformado:8,falecido:9,demitido:10}} //No Back-End iremos retornar os efectivos fora de atividade excepto os que tivere nestes sigpq_excluir_estado_reforma_idq_estado_reforma_id
        },
        component: ForaDeEfetividadeComponent
      },{
        path: 'inatividade-temporaria',
        data: {
          breadcrumb: 'Inatividade-Temporaria',
          type:{name:'inatividade-temporaria',sigpq_excluir_estado_reforma_id:{reformado:8,falecido:9,demitido:10}} //No Back-End iremos retornar os efectivos fora de atividade excepto os que tivere nestes sigpq_excluir_estado_reforma_idq_estado_reforma_id
        },
        component: ForaDeEfetividadeComponent
      },{
        path: 'protecao-social-reformados',
        data: {
          breadcrumb: 'Protecao-social-reformados',
          type:{name:'Reformados',sigpq_estado_reforma_id:8}
        },
        component: ProtecaoSocialComponent
      },{
        path: 'protecao-social-falecidos',
        data: {
          breadcrumb: 'Protecao-social-falecido',
          type:{name:'Falecidos',sigpq_estado_reforma_id:9}
        },
        component: ProtecaoSocialComponent
      },{
        path: 'protecao-social-demitidos',
        data: {
          breadcrumb: 'Protecao-social-demitido',
          type:{name:'Demitidos',sigpq_estado_reforma_id:10}
        },
        component: ProtecaoSocialComponent
      }
    ]

  }
];

@NgModule({
  // imports: [RouterModule.forChild(routes, { preloadingStrategy: PreloadAllModules })],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FuncionarioRoutingModule { }
