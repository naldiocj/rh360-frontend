import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarAssociacaoDelituosaComponent } from './listar-associacao-delituosa/listar-associacao-delituosa.component';
import { VerAssociacaoDelituosaComponent } from './ver-associacao-delituosa/ver-associacao-delituosa.component';
import { AssociacoesDelituososRoutingModule } from './associacoes-delituosos-routing.module';
import { AssociacoesDelituososViewComponent } from './associacoes-delituosos-view/associacoes-delituosos-view.component';
import { AntecedenteAssociacaoDelituosaComponent } from './modal/antecedente-associacao-delituosa/antecedente-associacao-delituosa.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { BuscaPipe } from '@resources/modules/sicgo/shared/busca/busca.pipe';
import { ModoOperanteAssociacaoDelituosaComponent } from './modal/modo-operante-associacao-delituosa/modo-operante-associacao-delituosa.component';


@NgModule({
  declarations: [
    ListarAssociacaoDelituosaComponent,
    VerAssociacaoDelituosaComponent,
    AssociacoesDelituososViewComponent,
    AntecedenteAssociacaoDelituosaComponent,
    BuscaPipe,
    ModoOperanteAssociacaoDelituosaComponent
  ],
  imports: [
    CommonModule,
    AssociacoesDelituososRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgSelect2Module,
    
  ]
})
export class AssociacoesDelituososModule { }
