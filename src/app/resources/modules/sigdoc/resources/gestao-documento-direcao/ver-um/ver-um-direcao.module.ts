import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerUmRoutingModule } from './ver-um-direcao-routing.module';
import { DocumentoOriginalComponent } from './resources/documento-original/documento-original.component';
import { VerUmDirecaoComponent } from './ver-um-direcao.component';
import { TratamentosDirecaoComponent } from './resources/tratamentos/tratamentos-direcao.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistarOuEditarComponent } from './resources/tratamentos/registar-ou-editar/registar-ou-editar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';
import { DespachosComponent } from './resources/despachos/despachos.component';
import { SaidasComponent } from './resources/saidas/saidas.component';
import { ExpedientesComponent } from './resources/expedientes/expedientes.component';
import { LoadingPageModule } from '@shared/components/loading-page.module';
import { PdfOrgaoArequivoComponent } from './resources/pdf-orgao-arequivo/pdf-orgao-arequivo.component';

@NgModule({
  declarations: [
    DocumentoOriginalComponent,
    VerUmDirecaoComponent,
    TratamentosDirecaoComponent,
    RegistarOuEditarComponent,
    DespachosComponent,
    SaidasComponent,
    ExpedientesComponent,
    PdfOrgaoArequivoComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    VerUmRoutingModule, 
    NgxPaginationModule,
    NgSelect2Module,
    LoadingPageModule,
  ]
})
export class VerUmModule { }
