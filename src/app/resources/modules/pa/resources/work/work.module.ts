import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkRoutingModule } from './work-routing.module';
import { NewWorkComponent } from './resources/new-work/new-work.component';
import { ListWorkComponent } from './resources/list-work/list-work.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedComponentsModule } from '../../shared/shared-components/shared-components.module';


@NgModule({
  declarations: [
    NewWorkComponent,
    ListWorkComponent
  ],
  imports: [
    CommonModule,
    WorkRoutingModule,
    NgxPaginationModule,
    FormsModule,
    SharedComponentsModule
  ]
})
export class WorkModule { }
