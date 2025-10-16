import { NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelect2Module } from "ng-select2";
import { NgxPaginationModule } from "ngx-pagination";
import { ExecucaoRoutingModule } from "./execucao-routing.module";
import { RegistrarOuEditarExecucaoComponent } from "./registrar-ou-editar-execucao/registrar-ou-editar-execucao.component";
import { ListarComponent } from "./listar/listar.component";
import {  NgxEditorModule } from 'ngx-editor';
import {AngularEditorModule } from "@kolkov/angular-editor";

@NgModule({
    declarations: [
        // ListarComponent,
        RegistrarOuEditarExecucaoComponent,
        ListarComponent
    ],

    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelect2Module,
        NgxPaginationModule,
        ExecucaoRoutingModule,
        NgxEditorModule,
        AngularEditorModule
    ]
})

export class ExecucaoModule { }

