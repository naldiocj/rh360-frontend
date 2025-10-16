import { NgModule } from "@angular/core";
import { EmergenciasComponent } from "./emergencias/emergencias.component";
import { NormalComponent } from "./normal/normal.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { DenunciasRoutingModule } from "./denuncias-routing.module";
import { AngularEditorModule } from "@kolkov/angular-editor";


@NgModule({
    declarations: [
        EmergenciasComponent,
        NormalComponent
    ],
    
    exports: [],
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        DenunciasRoutingModule,
        AngularEditorModule
    ]
})


export class DenunciaModule {}