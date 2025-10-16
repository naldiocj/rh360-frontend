import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeioAtribuidoRoutingModule } from './ordem-servico-routing.module';
import { ListarComponent } from './resources/listar/listar.component';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  declarations: [
    ListarComponent
  ],
  imports: [
    CommonModule,
    MeioAtribuidoRoutingModule,
    NgSelect2Module,
    NgxPaginationModule,
    FormsModule,
    NgxExtendedPdfViewerModule
  ]
})
export class MeioAtribuidoModule { }
