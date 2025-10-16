import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { NgSelect2Module } from "ng-select2";
// import { NgApexchartsModule } from "ng-apexcharts";
import { NgModule } from "@angular/core";
import { ListarComponent } from "./listar/listar.component";
import { MapaDeCursosRoutingModule } from "./mapa-de-cursos-routing.module";



@NgModule({
    declarations: [
        ListarComponent,
  
    ],
    exports: [],
    imports: [
      FormsModule,
      CommonModule,
      ReactiveFormsModule,
      NgxPaginationModule,
      MapaDeCursosRoutingModule,
      NgSelect2Module,
      // NgApexchartsModule,
     
    ]
  })
  export class MapaDeCursosModule { }
  