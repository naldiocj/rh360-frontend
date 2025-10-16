import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';
import { ListarComponent } from './listar/listar.component';
import { ComponentsModule } from '@resources/modules/sigpq/shared/components/components.module';
import { GestaoDocumentoDepartamentoRoutingModule } from './gestoa-documento-departamento-routing.module';
import { RecebidaComponent } from './recebida/recebida.component';
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { SeccaoEnviadaComponent } from './seccao-enviada/seccao-enviada.component';
import { LoadingPageModule } from '@shared/components/loading-page.module';

@NgModule({
  declarations: [
    ListarComponent,
    RecebidaComponent,
    RegistarOuEditarComponent,
    SeccaoEnviadaComponent,
  ],
  imports: [
    CommonModule,
    GestaoDocumentoDepartamentoRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgSelect2Module,
    ComponentsModule,
    LoadingPageModule,
  ]
})
export class GestaoDocumentoDepartamentoModule { }
