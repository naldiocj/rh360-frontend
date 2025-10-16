import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteComponent } from './delete/delete.component';
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { ListarComponent } from './listar/listar.component';
import { ComponentsModule } from '@resources/modules/sigpq/shared/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';
import { PlanoLicencasRoutingModule } from './plano-licencas-routing.module';
@NgModule({
  imports: [
    CommonModule,
    PlanoLicencasRoutingModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgSelect2Module,
    ComponentsModule
  ],
  declarations: [ListarComponent,DeleteComponent,RegistarOuEditarComponent]
})
export class PlanoLicencaModule { }
