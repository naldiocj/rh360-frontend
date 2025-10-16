import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarComponent } from './listar/listar.component';
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { ComponentsModule } from '@resources/modules/sigpq/shared/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';
import { DeleteComponent } from './delete/delete.component';
import { FuncaoRegimeRoutingModule } from './funcao-regime-routing.module';
@NgModule({
  imports: [
    CommonModule,
    FuncaoRegimeRoutingModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgSelect2Module,
    ComponentsModule
  ],
  declarations: [ListarComponent,RegistarOuEditarComponent,DeleteComponent]
})
export class FuncaoRegimeModule { }
