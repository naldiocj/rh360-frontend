import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxPaginationModule } from 'ngx-pagination';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { LoadingPageModule } from '@shared/components/loading-page.module';
import { DetalhesRoutingModule } from './detalhes-routing.module';

import { DetalhesComponent } from './detalhes.component';
import { DadosArguidoComponent } from './dados-arguido/dados-arguido.component';
import { DadosParecerComponent } from './dados-parecer/dados-parecer.component';
import { DadosProcessoComponent } from './dados-processo/dados-processo.component';
import { DadosIntervenienteComponent } from './dados-interveniente/dados-interveniente.component';
import { RegistarOuEditarParedecerComponent } from './dados-parecer/modal-registar-ou-editar/registar-ou-editar.component';
import { RegistarOuEditarIntervenienteComponent } from './dados-interveniente/modal-registar-ou-editar/registar-ou-editar.component';
import { RegistarOuEditarParedecerPecaComponent } from './dados-parecer/modal-registar-ou-editar-peca/registar-ou-editar-peca.component';
import { DadosDecisaoComponent } from './dados-decisao/dados-decisao.component';
import { RegistarOuEditarDecisaoComponent } from './dados-decisao/modal-registar-ou-editar/registar-ou-editar.component';
import { RegistarOuEditarDecisaoPecaComponent } from './dados-decisao/modal-registar-ou-editar-peca/registar-ou-editar-peca.component';
@NgModule({
  declarations: [
    DetalhesComponent,
    DadosArguidoComponent,
    DadosDecisaoComponent,
    DadosProcessoComponent,
    DadosIntervenienteComponent,
    DadosParecerComponent,
    RegistarOuEditarIntervenienteComponent,
    RegistarOuEditarParedecerComponent,
    RegistarOuEditarParedecerPecaComponent,
    RegistarOuEditarDecisaoComponent,
    RegistarOuEditarDecisaoPecaComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgSelect2Module,
    NgxPaginationModule,
    DetalhesRoutingModule,
    LoadingPageModule
  ]
})
export class DetalhesModule { }
