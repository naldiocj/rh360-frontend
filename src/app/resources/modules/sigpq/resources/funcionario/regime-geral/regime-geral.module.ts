import { NgModule } from '@angular/core';
import { RegimeGeralRoutingModule } from './regime-geral-routing.module'; 
import { CommonModule } from '@angular/common';
import { ListarComponent } from './listar/listar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
     ListarComponent
  ],
  imports: [
    CommonModule,
    RegimeGeralRoutingModule,
    NgxPaginationModule,
    FormsModule,
    // FuncionarioRoutingModule,
    // ReactiveFormsModule
  ]
})
export class RegimeGeralModule { }
