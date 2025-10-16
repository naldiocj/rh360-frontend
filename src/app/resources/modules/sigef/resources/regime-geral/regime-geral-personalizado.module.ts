import { NgModule } from "@angular/core";
import { ListarComponent } from "./listar/listar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { NgSelect2Module } from "ng-select2";
import { RegimeGeralRoutingModule } from "./regime-geral-personalizado-routing.module";


@NgModule({
    declarations: [
        ListarComponent
    ],
    exports: [],
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        NgSelect2Module,
        RegimeGeralRoutingModule

    ],
})

export class RegimeGeralModule {}