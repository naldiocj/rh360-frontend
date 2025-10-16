import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerUmRoutingModule } from './ver-um-routing.module';
import { DocumentoOriginalComponent } from './resources/documento-original/documento-original.component';
import { VerUmComponent } from './ver-um.component';
import { TratamentosComponent } from './resources/tratamentos/tratamentos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistarOuEditarComponent } from './resources/tratamentos/registar-ou-editar/registar-ou-editar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';
import { DespachosComponent } from './resources/despachos/despachos.component';
import { SaidasComponent } from './resources/saidas/saidas.component';
import { ExpedientesComponent } from './resources/expedientes/expedientes.component';
import { LoadingPageModule } from '@shared/components/loading-page.module';

@NgModule({
  declarations: [
    DocumentoOriginalComponent,
    VerUmComponent,
    TratamentosComponent,
    RegistarOuEditarComponent,
    DespachosComponent,
    SaidasComponent,
    ExpedientesComponent
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
