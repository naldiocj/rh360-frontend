import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ListarInstruendosComponent } from "./listar-instruendos/listar-instruendos.component";
import { RegistrarOuEditarComponent } from "./registrar-ou-editar/registrar-ou-editar.component";
import { CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { NgSelect2Module } from "ng-select2";
import { NgModule } from "@angular/core";
import { InstruendosRoutingModule } from "./instruendos-routing.module";


@NgModule({
  declarations: [ListarInstruendosComponent, RegistrarOuEditarComponent],
  exports: [],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgSelect2Module,
    InstruendosRoutingModule

  ],
})
export class InstruendosModule {}
