import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormulariosRoutingModule } from './formularios-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormulariosComponent } from './formularios.component';
import { ListarFormulariosComponent } from './listar-formularios/listar-formularios.component';
import { NgSelect2Module } from 'ng-select2';
import { RegistarOuEditarFormularioComponent } from './registar-ou-editar-formulario/registar-ou-editar-formulario.component';



@NgModule({
  declarations: [ 
    ListarFormulariosComponent,
    RegistarOuEditarFormularioComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    FormulariosRoutingModule,
    NgSelect2Module,
    NgxPaginationModule
  ]
})
export class FormulariosModule { }
