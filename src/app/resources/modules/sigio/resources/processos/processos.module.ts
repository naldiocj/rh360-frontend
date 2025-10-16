import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProcessoRoutingModule } from "./processos-routing.module";
import { NgxPaginationModule } from "ngx-pagination";
import { ListarComponent } from "./listar/listar.component";
import { NgSelect2Module } from "ng-select2";
import { RegistrarOuEditarComponent } from "./registrar-ou-editar/registrar-ou-editar.component";
import { PlaneamentoComponent } from './planeamento/planeamento.component';
import { Editor, NgxEditorModule } from "ngx-editor";
import { AngularEditorModule } from "@kolkov/angular-editor";




@NgModule({
    declarations: [
        ListarComponent,
        RegistrarOuEditarComponent,
        PlaneamentoComponent,
    ],

    imports: [
        NgxEditorModule,
        CommonModule,
        FormsModule,
        ProcessoRoutingModule,
        NgxPaginationModule,
        NgSelect2Module,
        ReactiveFormsModule,
        AngularEditorModule

    ]
})

export class ProcessoModule {}