import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { EquipamentosRoutingModule } from "./equipamentos-routing.module";



@NgModule({
    declarations: [
  ],

    exports: [],
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        EquipamentosRoutingModule,
        AngularEditorModule
    ]
})


export class EquipamentosModule {}