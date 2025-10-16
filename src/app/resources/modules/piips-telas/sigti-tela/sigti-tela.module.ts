import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SigtiTelaRoutingModule } from './sigti-tela-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { MainContentComponent } from './components/main-content/main-content.component';


@NgModule({
  declarations: [
    HeaderComponent,
    MainContentComponent
  ],
  imports: [
    CommonModule,
    SigtiTelaRoutingModule
  ]
})
export class SigtiTelaModule { }
