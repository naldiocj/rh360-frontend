import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArquivosRoutingModule } from './arquivos-routing.module';
import { ListarComponent } from './listar/listar.component';
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ListarProcessoIndividualComponent } from './listar-processo-individual/listar-processo-individual.component';
import { ListarAgregadoFamiliarComponent } from './listar-Agregado-Familiar/listar-Agregado-Familiar.component';
import { NgSelect2Module } from 'ng-select2';
import { CursosComponent } from './cursos/cursos.component';
import { FormacoesComponent } from './formacoes/formacoes.component';

@NgModule({
  declarations: [
    ListarComponent,
    RegistarOuEditarComponent,
    ListarProcessoIndividualComponent,
    ListarAgregadoFamiliarComponent,
    CursosComponent,
    FormacoesComponent
  ],
  imports: [
    CommonModule,
    ArquivosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgSelect2Module
  ]
})
export class ArquivosModule { }
