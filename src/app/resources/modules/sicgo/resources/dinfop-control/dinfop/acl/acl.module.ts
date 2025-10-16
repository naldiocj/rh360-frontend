import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AclRoutingModule } from './acl-routing.module';
import { AclComponent } from './acl.component';
// import { AclRoutingModule } from './acl-routing.module';

@NgModule({
  declarations: [
  
    AclComponent
  ],
  imports: [
    CommonModule,
    AclRoutingModule,
  ]
})
export class AclModule { }
