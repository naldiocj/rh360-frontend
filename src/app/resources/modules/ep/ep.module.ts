import { NgModule } from "@angular/core";
import { LayoutComponent } from "./layout/layout.component";
import { HeaderComponent } from "./layout/header/header.component";
import { SidebarComponent } from "./layout/sidebar/sidebar.component";
import { DashboardComponent } from "./resources/dashboard/dashboard.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelect2Module } from "ng-select2";
import { EpRoutingModule } from "./ep-routung.module";
import { NgxPaginationModule } from "ngx-pagination";

@NgModule({
    declarations: [
        LayoutComponent,
        HeaderComponent,
        SidebarComponent,
        DashboardComponent
    ],

    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgSelect2Module,
        NgSelect2Module,
        EpRoutingModule,
        FormsModule,
        NgxPaginationModule
    ]
})
export class EpModule {}