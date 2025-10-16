import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfiguracoesRoutingModule } from './configuracoes-routing.module';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    ConfiguracoesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ConfiguracoesModule { }
