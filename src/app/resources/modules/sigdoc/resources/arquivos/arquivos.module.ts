import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';
import { ArquivosRoutingModule } from './arquivos-routing.module';
import { ComponentsModule } from '@resources/modules/sigpq/shared/components/components.module';
import { ListarComponent } from './listar/listar.component';
import { LoadingPageModule } from '@shared/components/loading-page.module';

@NgModule({
  declarations: [
    RegistarOuEditarComponent,
    ListarComponent
   
  ],
  imports: [
    CommonModule,
    ArquivosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgSelect2Module,
    ComponentsModule,
    LoadingPageModule,
  ]
})
export class ArquivosModule { }
