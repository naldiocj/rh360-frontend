import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './resources/dashboard/dashboard.component';
import { ListarGuiaComponent } from './resources/listar-guia/listar-guia.component';
import { ListarNipComponent } from './resources/listar-nip/listar-nip.component';
import { ListarQrComponent } from './resources/listar-qr/listar-qr.component';
import { MultinipComponent } from './resources/multinip/multinip.component';
import { NipComponent } from './resources/nip/nip.component';
import { QrComponent } from './resources/qr/qr.component';
import { GuiaComponent } from './resources/guia/guia.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { SigcodeRoutingModule } from './sigcode-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { HeaderComponent } from './layout/header/header.component';
import { BodyComponent } from './layout/body/body.component';
import { DefaultComponent } from './layout/default/default.component';
import { NaoAtribuidosComponent } from './resources/nip-list/nao-atribuidos/nao-atribuidos.component';
import { AtribuidosComponent } from './resources/nip-list/atribuidos/atribuidos.component';
import { QRCodeModule } from 'angularx-qrcode';
import { HistoricoNipComponent } from './resources/historico/historico-nip/historico-nip.component';
import { HistoricoGuiaComponent } from './resources/historico/historico-guia/historico-guia.component';
import { MultiQrcodeComponent } from './resources/multi-qrcode/multi-qrcode.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LayoutComponent } from './layout/layout.component';
import { NgModule } from '@angular/core';
import { QrwriteComponent } from './resources/qrwrite/qrwrite.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgSelect2Module,
    NgxPaginationModule,
    SigcodeRoutingModule,
    QRCodeModule,
    
  ],
  declarations: [
    LayoutComponent,
    DefaultComponent,
    SidebarComponent,
    DashboardComponent,
    BodyComponent,

    GuiaComponent,
    HeaderComponent,
    ListarGuiaComponent,
    ListarNipComponent,
    ListarQrComponent,
    MultinipComponent,
    NipComponent,
    QrComponent,
    GuiaComponent,
    NaoAtribuidosComponent,
    AtribuidosComponent,
    HistoricoNipComponent,
    HistoricoGuiaComponent,
    MultiQrcodeComponent,
    QrwriteComponent,
  ],
})
export class SigcodeModule {}
