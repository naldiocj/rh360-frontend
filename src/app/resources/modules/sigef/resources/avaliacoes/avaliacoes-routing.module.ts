import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ListarAvaliarComponent } from "./avaliar/listar-avaliar/listar-avaliar.component";
import { AvaliacoesRoutingModule } from "./avaliacoes.module";
import { RegistrarOuEditarComponent } from "./avaliar/registrar-ou-editar/registrar-ou-editar.component";
import { NgSelect2Module } from "ng-select2";
import { NgxPaginationModule } from "ngx-pagination";

@NgModule({
    declarations: [
        ListarAvaliarComponent,
        RegistrarOuEditarComponent
    ],

    exports: [],
    
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        AvaliacoesRoutingModule,
        NgSelect2Module,
        NgxPaginationModule
    ]
})


export class AvaliacoesModule {}