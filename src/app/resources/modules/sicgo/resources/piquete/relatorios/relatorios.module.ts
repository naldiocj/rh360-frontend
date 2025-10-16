import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatoriosRoutingModule } from './relatorios-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { GeralComponent } from './geral/geral.component';


@NgModule({
  declarations: [
    GeralComponent
  ],
  imports: [
    CommonModule,
    RelatoriosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    QRCodeModule,
    NgSelect2Module
  ]
})
export class RelatoriosModule { }
