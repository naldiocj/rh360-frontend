import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SigpjTelaRoutingModule } from './sigpj-tela-routing.module';
import { CardComponent } from './components/card/card.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { MainContentComponent } from './components/main-content/main-content.component';


@NgModule({
  declarations: [
    CardComponent,
    FooterComponent,
    HeaderComponent,
    MainContentComponent
  ],
  imports: [
    CommonModule,
    SigpjTelaRoutingModule
  ]
})
export class SigpjTelaModule { }
