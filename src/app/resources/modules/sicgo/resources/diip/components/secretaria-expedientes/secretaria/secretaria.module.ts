import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecretariaRoutingModule } from './secretaria-routing.module';
import { SecretariaOcorrenciasComponent } from './secretaria-ocorrencias/secretaria-ocorrencias.component';
import { SecretariaComponent } from './secretaria.component'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { SecretariaExpedientesComponent } from './secretaria-expedientes/secretaria-expedientes.component';



@NgModule({
  declarations: [SecretariaExpedientesComponent, SecretariaOcorrenciasComponent, SecretariaComponent],
  imports: [
    CommonModule,
    SecretariaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgSelect2Module,
  ]
})
export class SecretariaModule { }
