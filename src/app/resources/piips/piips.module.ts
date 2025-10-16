import { CommonModule } from '@angular/common';
import { PiipsRoutingModule } from './piips-routing.module';
import { PiipsComponent } from './piips.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PiipsComponent],
  imports: [
    PiipsRoutingModule,
    CommonModule,
    FormsModule,
  ],
})

export class PiipsModule {}
