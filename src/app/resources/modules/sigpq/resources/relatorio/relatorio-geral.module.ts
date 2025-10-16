import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RelatorioGeralRoutingModule } from './relatorio-geral-routing.module';
import { RelatorioGeralComponent } from './relatorio-geral/relatorio-geral.component';
import { NgSelect2Module } from 'ng-select2';
import { FormsModule } from '@angular/forms';
import { RelatorioLicencaComponent } from './relatorio-licenca/relatorio-licenca.component';

@NgModule({
  declarations: [
    RelatorioGeralComponent,
    RelatorioLicencaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RelatorioGeralRoutingModule,
    NgSelect2Module
  ]
})
export class RelatorioGeralModule { }
