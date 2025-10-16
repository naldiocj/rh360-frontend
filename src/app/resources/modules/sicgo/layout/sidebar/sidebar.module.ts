import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingPageModule } from '@shared/components/loading-page.module';
import { NgSelect2Module } from 'ng-select2';
import { MenuDinfopComponent } from './menus/menu-dinfop/menu-dinfop.component';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
     
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingPageModule,
    NgSelect2Module,
    FormsModule,
    NgxPaginationModule
  ],
  exports: [
     
  ] 
})
export class SidebarModule { }
