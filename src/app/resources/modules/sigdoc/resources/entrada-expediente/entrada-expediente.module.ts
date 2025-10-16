import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { ListarComponent } from './listar/listar.component';
import { EntradaexpedienteRoutingModule } from './entrada-expediente-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';
import { HttpClientModule } from '@angular/common/http';
import { DetalheOuHistoricoComponent } from './detalhe-ou-historico/detalhe-ou-historico.component';
import { LoadingPageModule } from '@shared/components/loading-page.module';
@NgModule({
  declarations: [
    RegistarOuEditarComponent,
    DetalheOuHistoricoComponent,
    ListarComponent,
  ],
  imports: [
    CommonModule,
    EntradaexpedienteRoutingModule,
    FormsModule,
    NgxPaginationModule,
    NgSelect2Module,
    ReactiveFormsModule,
    HttpClientModule,
    LoadingPageModule,
  ]
})
export class EntradaexpedienteModule { }
