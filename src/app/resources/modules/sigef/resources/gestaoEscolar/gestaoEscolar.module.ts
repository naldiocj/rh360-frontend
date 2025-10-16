import { NgModule } from "@angular/core";
import { CursoComponent } from "./curso/curso.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgSelect2Module } from "ng-select2";
import { GestaoEscolarNewRoutingModule } from "./gestaoEscolar.routing.module";
import { DisciplinaComponent } from "./disciplina/disciplina.component";
import { NgxPaginationModule } from "ngx-pagination";
import { Editor, NgxEditorModule } from "ngx-editor";
import { AngularEditorConfig, AngularEditorModule } from "@kolkov/angular-editor"; 


@NgModule({
    declarations: [
        CursoComponent,
        DisciplinaComponent
    ],

    exports: [],
    imports: [
        NgxEditorModule,
        FormsModule,
        ReactiveFormsModule,
        GestaoEscolarNewRoutingModule,
        CommonModule,
        NgSelect2Module,
        NgxPaginationModule,
        AngularEditorModule
    ]
})

export class GestaoEscolarNewModule {}