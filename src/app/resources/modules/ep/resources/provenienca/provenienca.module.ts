import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { ProveniencasComponent } from './proveniencas/proveniencas.component';
import { ProveniencasRoutingModule } from "./provenienca-routing.module";



@NgModule({
    declarations: [
    ProveniencasComponent
  ],

    exports: [],
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        ProveniencasRoutingModule
    ]
})


export class ProveniencaModule {}