
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeriasRoutingModule } from './ferias-routing.module';
import { LicencasModule } from '../licencas/licencas.module';

@NgModule({
  imports: [
    CommonModule,
    FeriasRoutingModule,
    LicencasModule
  ]
})
export class FeriasModule { }
