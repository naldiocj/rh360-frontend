import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutrasRoutingModule } from './outras-routing.module';
import { PainelConfiguracaoExtraComponent } from './painel-configuracao-extra/painel-configuracao-extra.component';
import { AlturaModule } from './altura/altura.module';
import { IdadeModule } from './idade/idade.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PainelConfiguracaoExtraComponent
  ],
  imports: [
    CommonModule,
    OutrasRoutingModule,
   
    AlturaModule,
    IdadeModule
  ]
})
export class OutrasModule { }
