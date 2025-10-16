import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SigdocRoutingModule } from './sigdoc-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { PanelControloComponent } from './resources/panel-controlo/panel-controlo.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LinkComponent } from './components/link/link.component';

import { OnlineComponent } from './components/online/online.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LayoutComponent,
    PanelControloComponent,
    SidebarComponent,
    HeaderComponent,
    NavbarComponent,
    LinkComponent,
    OnlineComponent,
  ],
  imports: [FormsModule, CommonModule, SigdocRoutingModule],
})
export class SigdocModule {}
