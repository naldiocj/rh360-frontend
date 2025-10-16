import { NgModule } from "@angular/core";
import { ListarComponent } from "./listar/listar.component";
import { NgApexchartsModule } from "ng-apexcharts";
import { NgSelect2Module } from "ng-select2";
import { ProvenienciaRoutingModule } from "./proveniencia.module";
import { NgxPaginationModule } from "ngx-pagination";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations:[
        ListarComponent
    ],
    imports: [],
    exports: [
        NgModule,
        ReactiveFormsModule,
        NgApexchartsModule,
        ProvenienciaRoutingModule,
        NgSelect2Module,
        NgxPaginationModule,

    ]
})

export class PorvenienciaModule {}