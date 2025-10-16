import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelect2Module } from 'ng-select2';
import { FuncionarioRoutingModule } from './funcionario-routing.module';

import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';

import { DadosPessoaisProfissionalComponent } from './registar-ou-editar/dados-pessoais-profissional/dados-pessoais-profissional.component';
import { ProgressaoCarreiraComponent } from './registar-ou-editar/progressao-carreira/progressao-carreira.component';
import { ProcessoIndividualComponent } from './registar-ou-editar/processo-individual/processo-individual.component';
import { FuncionarioAgregadoFamiliarComponent } from './registar-ou-editar/funcionario-agregado-familiar/funcionario-agregado-familiar.component';
import { FuncionarioHistoricoFuncaoComponent } from './registar-ou-editar/funcionario-historico-funcao/funcionario-historico-funcao.component';
import { FuncionarioCargoComponent } from './registar-ou-editar/funcionario-cargo/funcionario-cargo.component';
import { FuncionarioColocaoComponent } from './registar-ou-editar/funcionario-colocao/funcionario-colocao.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ListarComponent } from './listar/listar.component';
import { SharedComponentsModule } from '@resources/modules/pa/shared/shared-components/shared-components.module';
import { CursosComponent } from './registar-ou-editar/cursos/cursos.component';
import { OutrosEmpregosComponent } from './registar-ou-editar/outros-empregos/outros-empregos.component';
import { ComponentsModule } from '../../shared/components/components.module';
import { MeiosComponent } from './registar-ou-editar/meios/meios.component';
import { LoadingPageModule } from '@shared/components/loading-page.module';
import { ForaDeEfetividadeComponent } from './fora-de-efetividade/fora-de-efetividade.component';
import { InformacaoForaDeEfetividadeComponent } from './informacao-fora-de-efetividade/informacao-fora-de-efetividade.component';
import { ListarParaPromocaoComponent } from './listar-para-promocao/listar-para-promocao.component';
// import { LoadingPageComponent } from '@shared/components/loading-page/loading-page.component';
import { PromoverModalComponent } from './listar-para-promocao/promover-modal/promover-modal.component';
import { VerSelecionadosComponent } from './listar-para-promocao/ver-selecionados/ver-selecionados.component';
import { RegistarOuEditarExceptoComponent } from './excepto/registar-ou-editar-excepto/registar-ou-editar-excepto.component';
import { ProtecaoSocialComponent } from './protecao-social/protecao-social.component';
import { ListarPassivoComponent } from './listar-passivos/listar-passivos.component';
import { ImpressaoDigitalComponent } from './registar-ou-editar/impressao-digital/impressao-digital.component';
import { AssinaturaDigitalComponent } from './registar-ou-editar/assinatura-digital/assinatura-digital.component';
import { GeometriaDeRostoComponent } from './registar-ou-editar/geometria-de-rosto/geometria-de-rosto.component';
import { MaosBiometricoComponent } from './registar-ou-editar/impressao-digital/maos-biometrico/maos-biometrico.component';


@NgModule({
  declarations: [
    RegistarOuEditarComponent,
    ProcessoIndividualComponent,
    DadosPessoaisProfissionalComponent,
    ProgressaoCarreiraComponent,
    FuncionarioAgregadoFamiliarComponent,
    FuncionarioHistoricoFuncaoComponent,
    FuncionarioCargoComponent,
    FuncionarioColocaoComponent,
    ForaDeEfetividadeComponent,
    InformacaoForaDeEfetividadeComponent,
    ListarComponent,
    CursosComponent,
    MeiosComponent,
    ListarParaPromocaoComponent,
    PromoverModalComponent,
    VerSelecionadosComponent,
    RegistarOuEditarExceptoComponent,
    ProtecaoSocialComponent,
    OutrosEmpregosComponent,
    ListarPassivoComponent,
    ImpressaoDigitalComponent,
    AssinaturaDigitalComponent,
    GeometriaDeRostoComponent,
    MaosBiometricoComponent
    // LoadingPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    FuncionarioRoutingModule,
    NgxPaginationModule,
    NgSelect2Module,
    SharedComponentsModule,
    ComponentsModule,
    LoadingPageModule
  ],
  exports:[ListarComponent]
})
export class FuncionarioModule { }
