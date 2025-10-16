import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { SigvestuarioModule } from '@resources/modules/sigvestuario/sigvestuario.module';

import { ColectivaRoutingModule } from './colectiva-routing.module';
import { ListarComponent } from './listar/listar.component';
import { ListarMeiosComponent } from './listar-meios/listar-meios.component';


@NgModule({
  declarations: [
    ListarComponent,
    ListarMeiosComponent
  ],
  imports: [
    CommonModule,
    ColectivaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    NgxPaginationModule,
    SigvestuarioModule
  ]
})
export class ColectivaModule { }
