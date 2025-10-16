import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';
import { EnviadaComponent } from './listar/enviada/enviada.component';
import { RecebidaComponent } from './listar/recebida/recebida.component';
import { GestaoCorrespondenciaRoutingModule } from './gestao-correspondencia-routing.module';
import { ComponentsModule } from '@resources/modules/sigpq/shared/components/components.module';
import { EntradaexpedienteModule } from '../entrada-expediente/entrada-expediente.module';
import { LoadingPageModule } from '@shared/components/loading-page.module';

@NgModule({
  declarations: [
    RegistarOuEditarComponent,
    EnviadaComponent,
    RecebidaComponent,
  ],
  imports: [
    CommonModule,
    GestaoCorrespondenciaRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgSelect2Module,
    ComponentsModule,
    EntradaexpedienteModule,
    LoadingPageModule,
  ]
})
export class GestaCorrrespondenciaModule { }
