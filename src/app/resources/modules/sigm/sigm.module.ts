import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { SigmRoutingModule } from "./sigm-routing.module";
import { NgSelect2Module } from "ng-select2";
import { DashboardComponent } from './resources/dashboard/dashboard.component';

import { SidebarComponent } from "./layout/sidebar/sidebar.component";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { RouterLink, RouterModule } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { HeaderComponent } from "./layout/header/header.component";

@NgModule({
    declarations: [
        DashboardComponent,
        HeaderComponent,
        SidebarComponent,
        LayoutComponent
    ],

    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelect2Module,
        NgxPaginationModule,
        SigmRoutingModule,
        AngularEditorModule,
        RouterModule
    ]
})
export class SigmModule {}