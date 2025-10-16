import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelect2Module } from "ng-select2";
import { LayoutComponent } from "./layout/layout.component";
import { HeaderComponent } from "./layout/header/header.component";
import { DashboardComponent } from "../sigio/resources/dashboard/dashboard.component";
import { SidebarComponent } from "../sigio/layout/sidebar/sidebar.component";
import { SigioRoutingModule } from "./sigio-routing.module";
import { ListarComponent } from './resources/execucao/listar/listar.component';


@NgModule({
    declarations: [
        LayoutComponent,
        HeaderComponent,
        SidebarComponent,
        DashboardComponent,
        // ListarComponent,

       
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelect2Module,
        SigioRoutingModule
    ]
})


export class SigiogModule {}