import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { ListarComponent } from "./listar/listar.component";
import { FormadoresRoutingModule } from "./formadores-routing.module";
import { NgSelect2Module } from "ng-select2";
import { RegistrarOuEditarComponent } from "./registrar-ou-editar/registrar-ou-editar.component";
import { PerfilUtilizadorComponent } from "./perfil-utilizador/perfil-utilizador.component";

@NgModule({
    declarations: [
        ListarComponent,
        RegistrarOuEditarComponent,
        PerfilUtilizadorComponent

    ],
    exports: [],
    imports: [
        FormsModule,
        NgxPaginationModule,
        CommonModule,
        ReactiveFormsModule,
        FormadoresRoutingModule,
        NgxPaginationModule,
        NgSelect2Module
    ]
})

export class FormadoresModule { }