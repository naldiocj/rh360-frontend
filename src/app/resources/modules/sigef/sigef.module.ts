import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { NgApexchartsModule } from "ng-apexcharts";
import { NgxPaginationModule } from "ngx-pagination";
import { SigefRoutingModule } from "./sigef.routing.module";
import { DashboardComponent } from "./resources/dashboard/dashboard.component";
import { NgSelect2Module } from "ng-select2";
import { SidebarComponent } from "../sigef/layout/sidebar/sidebar.component";
import { HeaderComponent } from "./layout/header/header.component";
import { LayoutComponent } from "./layout/layout.component";




@NgModule({
    declarations: [
        DashboardComponent,
        SidebarComponent,
        HeaderComponent,
        LayoutComponent

    ],

    imports: [
        CommonModule,
        FormsModule,
        // NgApexchartsModule,
        NgxPaginationModule,
        SigefRoutingModule,
        ReactiveFormsModule,
        NgSelect2Module,
        ReactiveFormsModule
    ]
})

export class SigefModule {}