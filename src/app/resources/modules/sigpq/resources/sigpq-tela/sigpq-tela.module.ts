import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    CardComponent,
    HeaderComponent,
    FooterComponent,
    MainContentComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SigpqTelaModule { }
