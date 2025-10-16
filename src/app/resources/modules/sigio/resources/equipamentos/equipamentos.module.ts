import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { ListarComponent } from "./listar/listar.component";
import { NgSelect2Module } from "ng-select2";
import { RegistrarOuEditarEquipamentosComponent } from './registrar-ou-editar-equipamentos/registrar-ou-editar-equipamentos.component';
import { EquipamentosRoutingModule } from "./equipamentos-routing.module";
import { Editor, NgxEditorModule } from "ngx-editor"; 
import { AngularEditorConfig, AngularEditorModule } from "@kolkov/angular-editor"; 


@NgModule({
    declarations: [
        ListarComponent,
        RegistrarOuEditarEquipamentosComponent
    ],

    imports: [
        NgxEditorModule,
        CommonModule,
        FormsModule,
        EquipamentosRoutingModule,
        NgxPaginationModule,
        NgSelect2Module,
        ReactiveFormsModule,
        AngularEditorModule

    ]
})

export class EquipamentosModule {}