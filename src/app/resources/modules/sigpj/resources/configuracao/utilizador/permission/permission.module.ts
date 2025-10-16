import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common'; 
import { PermissionRoutingModule } from './permission-routing.module';

import { NgxPaginationModule } from 'ngx-pagination';

// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2'; 
import { PermissionComponent } from './permission.component';
@NgModule({
  declarations: [  
    PermissionComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    PermissionRoutingModule,
    NgSelect2Module,
    NgxPaginationModule
  ]
})
export class  PermissionModule { }
