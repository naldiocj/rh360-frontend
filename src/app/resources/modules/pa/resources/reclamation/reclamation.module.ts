import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReclamationRoutingModule } from './reclamation-routing.module';
import { SendReclamationComponent } from './resources/send-reclamation/send-reclamation.component';
import { ListReclamationComponent } from './resources/list-reclamation/list-reclamation.component';
// import { TINYMCE_SCRIPT_SRC, EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [
    SendReclamationComponent,
    ListReclamationComponent
  ],
  imports: [
    CommonModule,
    ReclamationRoutingModule,
    // EditorModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelect2Module,
    NgxPaginationModule,
    AngularEditorModule
  ],
  providers: [
    // {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'}
  ]
})
export class ReclamationModule { }
