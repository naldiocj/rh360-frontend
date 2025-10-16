import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { ListaTestemunhaComponent } from './lista/lista.component';
import { TestemunhaOuIntevenientesRoutingModule } from './testemunha-ou-intevenientes-routing.module';
 

@NgModule({
  declarations: [ListaTestemunhaComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    TestemunhaOuIntevenientesRoutingModule,
    QRCodeModule,
    NgSelect2Module,
  ]
})
export class TestemunhaOuIntevenientesModule { }
