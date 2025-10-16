import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingPageComponent} from './loading-page/loading-page.component';
import { ZeroFrenteNPipe } from './pipes/zero-frente-n.pipe';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { ShortOrdemPipe } from './pipes/short-ordem.pipe';
import { ShortPatentePipe } from './pipes/short-patente.pipe';
import { FeedbackChatComponent } from '@resources/feedback/feedback.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoadingPageComponent, ZeroFrenteNPipe, CapitalizePipe, ShortOrdemPipe, ShortPatentePipe,FeedbackChatComponent],
  imports: [CommonModule,ReactiveFormsModule],
  exports: [LoadingPageComponent, ZeroFrenteNPipe, CapitalizePipe, ShortOrdemPipe, ShortPatentePipe,FeedbackChatComponent],
})
export class LoadingPageModule {}
