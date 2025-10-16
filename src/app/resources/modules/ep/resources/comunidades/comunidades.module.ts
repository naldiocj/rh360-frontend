import { NgModule } from "@angular/core";
import { ComunidadesComponent } from "./comunidades/comunidades.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { ComunidadesRoutingModule } from "./comunidades-routing.module";


@NgModule({
    declarations: [
        ComunidadesComponent
    ],

    exports: [],
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        ComunidadesRoutingModule
    ]
})


export class ComunidadeModule {}