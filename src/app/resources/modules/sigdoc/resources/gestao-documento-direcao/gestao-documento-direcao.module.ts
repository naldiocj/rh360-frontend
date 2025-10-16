import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';
import { GestaoDocumentoDirecaoRoutingModule } from './gestao-documento-direcao-routing.module';
import { ComponentsModule } from '@resources/modules/sigpq/shared/components/components.module';
import { ListarComponent } from './listar/listar.component';
import { RecebidaDirecaoComponent } from './recebida-direcao/recebida-direcao.component';
import { EnviadaDepartamentoComponent } from './enviada-departamento/enviada-departamento.component';
import { LoadingPageModule } from '@shared/components/loading-page.module';
import { ListarDocumentoComponent } from './listar-documento/listar-documento.component';
import { ChatComponent } from './chat/chat.component';
import { CriarDocumentoComponent } from './criar-documento/criar-documento.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { CriardocumentolistaComponent } from './criar-documento-lista/criar-documento-lista.component';


@NgModule({
  declarations: [
    ListarComponent,
    RegistarOuEditarComponent,
    RecebidaDirecaoComponent,
    EnviadaDepartamentoComponent,
    ListarDocumentoComponent,
    ChatComponent,
    CriarDocumentoComponent,
    CriardocumentolistaComponent
    
  ],
  imports: [
    CommonModule,
    GestaoDocumentoDirecaoRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgSelect2Module,
    ComponentsModule,
    LoadingPageModule,
    EditorModule
  ]
})
export class GestaoDocumentoDirecaoModule { }
