import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SigvestuarioRoutingModule } from './sigvestuario-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { SideNavbarComponent } from './layout/side-navbar/side-navbar.component';
import { DashboardComponent } from './resources/dashboard/dashboard.component';
import { CardComponent } from './resources/dashboard/card/card.component';
import { ListarEfectivosModalComponent } from './shared/listar-efectivos-modal/listar-efectivos-modal.component';
import { AtribuirMeiosModalComponent } from './shared/atribuir-meios-modal/atribuir-meios-modal.component';
import { ListarOrgaosEComandosModalComponent } from './shared/listar-orgaos-e-comandos-modal/listar-orgaos-e-comandos-modal.component';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    SideNavbarComponent,
    DashboardComponent,
    CardComponent,
    ListarEfectivosModalComponent,
    AtribuirMeiosModalComponent,
    ListarOrgaosEComandosModalComponent
  ],
  imports: [
    CommonModule,
    SigvestuarioRoutingModule,
    SwiperModule,
    NgSelect2Module,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ListarEfectivosModalComponent,
    AtribuirMeiosModalComponent,
    ListarOrgaosEComandosModalComponent
  ]
})
export class SigvestuarioModule { }
