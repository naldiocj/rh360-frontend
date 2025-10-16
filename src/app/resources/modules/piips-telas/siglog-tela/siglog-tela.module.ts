import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiglogTelaRoutingModule } from './siglog-tela-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { MainContentComponent } from './components/main-content/main-content.component';


@NgModule({
  declarations: [
    HeaderComponent,
    MainContentComponent
  ],
  imports: [
    CommonModule,
    SiglogTelaRoutingModule
  ]
})
export class SiglogTelaModule { }
