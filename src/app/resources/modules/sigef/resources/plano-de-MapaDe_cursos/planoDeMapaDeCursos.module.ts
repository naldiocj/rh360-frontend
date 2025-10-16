import { NgModule } from "@angular/core";
import { ListarComponent } from "./listar/listar.component";
import { RegistrarOuEditarComponent } from "./registrar-ou-editar/registrar-ou-editar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { NgSelect2Module } from "ng-select2";
// import { NgApexchartsModule } from "ng-apexcharts";
import { PladoDeMapaDeCursosRoutingModule } from "./planoDeMapaDeCursos-routing.module";



@NgModule({
    declarations: [
        ListarComponent,
    ],
    exports: [],
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        PladoDeMapaDeCursosRoutingModule,
        NgxPaginationModule,
        NgSelect2Module,
        // NgApexchartsModule
    ]
})

export class PladoDeMapaDeCursosModule {}