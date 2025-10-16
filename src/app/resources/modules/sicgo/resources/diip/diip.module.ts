import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiipComponent } from './diip.component';
import { DiipRoutingModule } from './diip-routing.module';
import { ListarComponent } from './listar/listar.component';
import { DiipViewComponent } from './diip-view/diip-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { DiipRegistoOrigemComponent } from './modal/registo-origem/registo-origem.component';
import { RegistarOuEditarComponent } from './modal/registar-ou-editar/registar-ou-editar.component';
import { MinisterioExpedientesComponent } from './components/ministerio-expedientes/ministerio-expedientes.component';
import { OpcsExpedientesComponent } from './components/opcs-expedientes/opcs-expedientes.component';
import { ChefiaExpedientesComponent } from './components/chefia-expedientes/chefia-expedientes.component';
import { DepartamentoExpedientesComponent } from './components/departamento-expedientes/departamento-expedientes.component';
import { AuditoriaExpedientesComponent } from './components/auditoria-expedientes/auditoria-expedientes.component';
import { LoadingPageModule } from '@shared/components/loading-page.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { SharedcomponentsModule } from '../../shared/components/sharedcomponents.module';
 

@NgModule({
  declarations: [
    DiipComponent,
    ListarComponent,
    DiipViewComponent,
    DiipRegistoOrigemComponent,
    RegistarOuEditarComponent,
    MinisterioExpedientesComponent,
    OpcsExpedientesComponent,
    ChefiaExpedientesComponent,
    DepartamentoExpedientesComponent,
    AuditoriaExpedientesComponent,
  ],
  imports: [
    CommonModule,
    DiipRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    NgxPaginationModule,
    NgSelect2Module,    
        SharedcomponentsModule,
        LoadingPageModule,
        EditorModule,
        LoadingPageModule
  ]
})
export class DiipModule { }
