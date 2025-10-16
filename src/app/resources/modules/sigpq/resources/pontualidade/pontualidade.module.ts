import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PontualidadeComponent } from './pontualidade.component';
import { PontualidadeRoutingModule } from './pontualidade-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingPageModule } from '../../../../../shared/components/loading-page.module';
import { AdicionarPontualidadeComponent } from './adicionar-pontualidade/adicionar-pontualidade.component';
import { DraggablePontualidadeDirective } from './directiva/Draggable.directive';
import { AnalisarPontualidadeComponent } from './analisar-pontualidade/analisar-pontualidade.component';
import { PlanificarPontualidadeComponent } from './planificar-pontualidade/planificar-pontualidade.component';

@NgModule({
  imports: [
    CommonModule,
    PontualidadeRoutingModule,
    FormsModule,
    FullCalendarModule,
    ReactiveFormsModule,
    NgSelect2Module,
    NgxPaginationModule,
    LoadingPageModule
  ],
  declarations: [PontualidadeComponent,AdicionarPontualidadeComponent,DraggablePontualidadeDirective,
    AnalisarPontualidadeComponent,
    PlanificarPontualidadeComponent]
})
export class PontualidadeModule { }
