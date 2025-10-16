import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelect2Module } from "ng-select2";
import { NgxPaginationModule } from "ngx-pagination";
import { ListarComponent } from "../alistados/listar/listar.component";
import { RegistarOuEditarComponent } from "../alistados/registar-ou-editar/registar-ou-editar.component";
import { AlistadosRoutingModule } from "./alistados-routing.module";


@NgModule({
    declarations: [
        ListarComponent,
        RegistarOuEditarComponent
    ],

    exports: [],
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        NgSelect2Module,
        AlistadosRoutingModule,
        NgxPaginationModule
    ]
})

export class AlistadosModule { }