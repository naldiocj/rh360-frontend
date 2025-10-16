import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { TrabalhosRoutingModule } from "./trabalhos-routing.module";
import { TrabalhosComponent } from './trabalhos/trabalhos.component';
import { AngularEditorModule } from "@kolkov/angular-editor";



@NgModule({
    declarations: [
    TrabalhosComponent
  ],

    exports: [],
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        TrabalhosRoutingModule,
        AngularEditorModule
    ]
})


export class TrabalhosModule {}