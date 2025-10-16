import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RegimeEspecialRoutingModule } from './regime-especial-routing.module';

import { NgxPaginationModule } from 'ngx-pagination';

// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { ListarComponent } from './listar/listar.component';
@NgModule({
  declarations: [
    ListarComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RegimeEspecialRoutingModule,
    NgSelect2Module,
    NgxPaginationModule
  ]
})
export class RegimeGeralModule { }
