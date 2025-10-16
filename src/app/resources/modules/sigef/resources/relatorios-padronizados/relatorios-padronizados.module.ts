import { NgModule } from "@angular/core";
import { ListarComponent } from "./listar/listar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { NgSelect2Module } from "ng-select2";
import { RelatorioPadronizadosRoutingModule } from "./relatorios-padronizados-routing.module";


@NgModule({
    declarations: [
        ListarComponent
    ],
    exports: [],
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        RelatorioPadronizadosRoutingModule,
        NgxPaginationModule,
        NgSelect2Module,

    ]
})

export class RelatoriosPadronizadosModule {}