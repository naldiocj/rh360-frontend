import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarAssociacaoGruposComponent } from './listar-associacao-grupos/listar-associacao-grupos.component';
import { VerAssociacaoGruposComponent } from './ver-associacao-grupos/ver-associacao-grupos.component';
import { AssociacoesGruposRoutingModule } from './associacoes-grupos-routing.module';
import { AssociacoesGruposViewComponent } from './associacoes-grupos-view/associacoes-grupos-view.component';
import { AntecedenteAssociacaoGruposComponent } from './modal/antecedente-associacao-grupos/antecedente-associacao-grupos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { BuscaGruposAssociadosPipe } from '@resources/modules/sicgo/shared/Pipe/busca_grupos_associados/busca-grupos-associados.pipe';
import { ModoOperanteGrupoAssociacaoComponent } from './modal/modo-operante-associacao/modo-operante-associacao.component';



@NgModule({
  declarations: [
    ListarAssociacaoGruposComponent,
    VerAssociacaoGruposComponent,
    AssociacoesGruposViewComponent,
    AntecedenteAssociacaoGruposComponent,
    BuscaGruposAssociadosPipe,
    ModoOperanteGrupoAssociacaoComponent
  ],
  imports: [
    CommonModule,
    AssociacoesGruposRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgSelect2Module,
  ]
})
export class AssociacoesGruposModule { }
