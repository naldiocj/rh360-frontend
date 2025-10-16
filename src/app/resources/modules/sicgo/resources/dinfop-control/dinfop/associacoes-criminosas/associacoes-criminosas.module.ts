import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssociacoesCriminosasRoutingModule } from './associacoes-criminosas-routing.module';
import { AssociacoesCriminosasComponent } from './associacoes-criminosas.component';
 


@NgModule({
  declarations: [
    AssociacoesCriminosasComponent
  ],
  imports: [
    CommonModule,
    AssociacoesCriminosasRoutingModule
  ]
})
export class AssociacoesCriminosasModule { }
