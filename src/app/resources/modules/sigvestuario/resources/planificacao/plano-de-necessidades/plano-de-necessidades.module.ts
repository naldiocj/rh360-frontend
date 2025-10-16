import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { SigvVersion2Module } from '@resources/modules/sigv-version2/sigv-version2.module';
import { EditarPlanosEAbastecimetosModule } from '@resources/modules/sigv-version2/shared/modulos/editar-planos-e-abastecimetos/editar-planos-e-abastecimetos.module';

import { PlanoDeNecessidadesRoutingModule } from './plano-de-necessidades-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { RegistarComponent } from './registar/registar.component';
import { ListarComponent } from './listar/listar.component';
import { RegistarMeiosComponent } from './registar-meios/registar-meios.component';
import { ListarMeiosComponent } from './listar-meios/listar-meios.component';


@NgModule({
  declarations: [
    LayoutComponent,
    RegistarComponent,
    ListarComponent,
    RegistarMeiosComponent,
    ListarMeiosComponent
  ],
  imports: [
    CommonModule,
    PlanoDeNecessidadesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    NgxPaginationModule,
    SigvVersion2Module,
    EditarPlanosEAbastecimetosModule
  ]
})
export class PlanoDeNecessidadesModule { }
