import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgSelect2Module } from 'ng-select2';
import { FormsModule } from '@angular/forms';
import { ListarComponent } from './listar/listar.component';
import { SituacaoDisciplinarRoutingModule } from './situacao-disciplinar-routing.module';
import { LoadingPageModule } from '@shared/components/loading-page.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ComponentsModule } from '../../shared/components/components.module';

@NgModule({
  declarations: [
    ListarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelect2Module,
    SituacaoDisciplinarRoutingModule,
    NgxPaginationModule,
    LoadingPageModule,
    ComponentsModule
  ]
})
export class SituacaoDisciplinarModule { }
