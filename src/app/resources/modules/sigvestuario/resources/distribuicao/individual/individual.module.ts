import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { SigvestuarioModule } from '@resources/modules/sigvestuario/sigvestuario.module';


import { IndividualRoutingModule } from './individual-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { RegistarComponent } from './registar/registar.component';
import { ListarComponent } from './listar/listar.component';
import { ListarMeiosComponent } from './listar-meios/listar-meios.component';


@NgModule({
  declarations: [
    LayoutComponent,
    RegistarComponent,
    ListarComponent,
    ListarMeiosComponent
  ],
  imports: [
    CommonModule,
    IndividualRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    NgxPaginationModule,
    SigvestuarioModule
  ]
})
export class IndividualModule { }
