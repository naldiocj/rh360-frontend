import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SigipTelaRoutingModule } from './sigip-tela-routing.module';
import { MainContentComponent } from './components/main-content/main-content.component';
import { HeaderComponent } from './components/header/header.component';


@NgModule({
  declarations: [
    MainContentComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    SigipTelaRoutingModule
  ]
})
export class SigipTelaModule { }
