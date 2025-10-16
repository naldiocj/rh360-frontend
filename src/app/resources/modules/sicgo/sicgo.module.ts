import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule, NgChartsConfiguration } from 'ng2-charts';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { DashboardComponent } from './resources/dashboard/dashboard.component';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';
import { SharedcomponentsModule } from './shared/components/sharedcomponents.module';
import { SicgoRoutingModule } from './sicgo-routing.module';
import { FingerprintService } from '@resources/modules/sicgo/core/service/fingerprint/FingerprintService.service';
import { LoadingPageModule } from '@shared/components/loading-page.module';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { SidebarComponent } from './layout/sidebar/sidebar/sidebar.component';
import { NotificacaoComponent } from './layout/header/notificacao/notificacao.component';
import { PesquisarOcorrenciasPipe } from './shared/Pipe/pesquisar_ocorrencias/pesquisar-ocorrencias.pipe';
import { MenuDinfopComponent } from './layout/sidebar/menus/menu-dinfop/menu-dinfop.component';
import { FileSizePipe } from './shared/Pipe/file-size/file-size.pipe';
 

//menus
@NgModule({
  declarations: [
    NavbarComponent,
    LayoutComponent,
    FooterComponent,
    HeaderComponent, 
    DashboardComponent,
    BreadcrumbComponent,
    SidebarComponent,
    MenuDinfopComponent,
    NotificacaoComponent
    
    ],
  imports: [
    CommonModule,
    SicgoRoutingModule,
    NgChartsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedcomponentsModule,
    NgSelect2Module,
    NgxPaginationModule, 
    LoadingPageModule 
  ],
  providers: [
    FingerprintService,
    { provide: NgChartsConfiguration, useValue: { generateColors: false } },
  ], 
  schemas: [NO_ERRORS_SCHEMA],
})
export class SicgoModule {}
