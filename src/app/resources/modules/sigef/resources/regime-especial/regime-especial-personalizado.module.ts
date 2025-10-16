import { NgModule } from "@angular/core";
import { ListarComponent } from "./listar/listar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { NgSelect2Module } from "ng-select2";
import { RegimeEspecialRoutingModule } from "./regime-especial-personalizado-routing.module";
import { RegistarOuEditarComponent } from "../relatorios-personalizados/registar-ou-editar/registar-ou-editar.component";


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
        RegimeEspecialRoutingModule
    ],
})

export class RegimeEspecialModule {}