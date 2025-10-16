import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CriarDocumentoRoutingModule } from './criar-documento-routing.module';
import { ListarComponent } from './listar/listar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DocumentoComponent } from './documento/documento.component';
// import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    ListarComponent, 
    DocumentoComponent
  ],
  imports: [
    CommonModule,
    CriarDocumentoRoutingModule,
    NgxPaginationModule,
    NgSelect2Module,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AngularEditorModule,
    //QuillModule.forRoot(),
    //DocumentEditorModule,
  ],
})
export class CriarDocumentoModule {}
