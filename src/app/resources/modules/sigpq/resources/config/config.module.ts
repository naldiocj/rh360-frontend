import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ConfigRoutingModule } from './config-routing.module';

@NgModule({
  declarations: [

  ],
  // exports: [RegistarOuEditarModalComponent],
  imports: [
    CommonModule,
    ConfigRoutingModule,
  ]
})
export class ConfigModule { }
