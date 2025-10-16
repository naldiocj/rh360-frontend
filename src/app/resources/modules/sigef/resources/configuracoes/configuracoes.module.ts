import { NgModule } from "@angular/core";
import { ListarComponent } from "./listar/listar.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ConfiguracoesRoutingModule } from "./configuracoes.routing.module";
import { RegitrarOuEditarComponent } from "./regitrar-ou-editar/regitrar-ou-editar.component";
import { NgSelect2Component, NgSelect2Module } from "ng-select2";
import { NgxPaginationModule } from "ngx-pagination";


@NgModule({
    declarations: [
        ListarComponent,
        RegitrarOuEditarComponent
        
    ],
    exports: [],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        ConfiguracoesRoutingModule,        
        ReactiveFormsModule,
        NgSelect2Module,
        NgxPaginationModule
    ]
})

export class ConfiguracoesModule { }