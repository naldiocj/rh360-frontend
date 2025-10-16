import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';
import { ComponentsModule } from '@resources/modules/sigpq/shared/components/components.module';
import { ArquivoOrgaoComponent } from './listar/listar.component';
import { ArquivoOrgaoRoutingModule } from './arquivos-orgao-routing.module';
import { PdfOrgaoArequivoComponent } from './pdf-orgao-arequivo/pdf-orgao-arequivo.component';
import { LoadingPageModule } from '@shared/components/loading-page.module';

@NgModule({
  declarations: [
    ArquivoOrgaoComponent,
    PdfOrgaoArequivoComponent,
  ],
  imports: [
    CommonModule,
    ArquivoOrgaoRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgSelect2Module,
    ComponentsModule,
    LoadingPageModule,
  ]
})
export class ArquivosOrgaoModule { }
