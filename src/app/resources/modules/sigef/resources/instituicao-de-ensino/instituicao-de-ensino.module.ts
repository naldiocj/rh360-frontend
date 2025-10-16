import { NgModule } from "@angular/core";
import { ListarComponent } from "./listar/listar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgSelect2Module } from "ng-select2";
import { NgxPaginationModule } from "ngx-pagination";
import { IstituicaoDeEnsinoRoutingModule } from "./instituicao-de-ensino-routing.module";
import { RegistrarOuEditarComponent } from "./registrar-ou-editar/registrar-ou-editar.component";
import { Editor, NgxEditorModule } from 'ngx-editor'; 
import { AngularEditorConfig, AngularEditorModule } from "@kolkov/angular-editor";

@NgModule({
    declarations: [
        ListarComponent,
        RegistrarOuEditarComponent
    ],
    exports: [],
    imports: [
        NgxEditorModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        IstituicaoDeEnsinoRoutingModule,
        NgSelect2Module,
        NgxPaginationModule,
        AngularEditorModule
    ]
})

export class IstituicaoDeEnsinoModule {}