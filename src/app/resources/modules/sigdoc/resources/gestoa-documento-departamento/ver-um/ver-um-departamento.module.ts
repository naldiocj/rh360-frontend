import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentoOriginalComponent } from './resources/documento-original/documento-original.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistarOuEditarComponent } from './resources/tratamentos/registar-ou-editar/registar-ou-editar.component';
import { TratamentosDepartamentoComponent } from './resources/tratamentos/tratamentos-departamento.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';
import { DespachosComponent } from './resources/despachos/despachos.component';
import { SaidasComponent } from './resources/saidas/saidas.component';
import { ExpedientesComponent } from './resources/expedientes/expedientes.component';
import { VerUmDepartamentoComponent } from './ver-um-departamento.component';
import { VerUmDepartamentoRoutingModule } from './ver-um-departamento-routing.module';
import { LoadingPageModule } from '@shared/components/loading-page.module';

@NgModule({
  declarations: [
    DocumentoOriginalComponent,
    VerUmDepartamentoComponent,
    TratamentosDepartamentoComponent,
    RegistarOuEditarComponent,
    DespachosComponent,
    SaidasComponent,
    ExpedientesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    VerUmDepartamentoRoutingModule, 
    NgxPaginationModule,
    NgSelect2Module,
    LoadingPageModule,
  ]
})
export class VerUmModule { }
