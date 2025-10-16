import { SharedComponentsModule } from '@resources/modules/pa/shared/shared-components/shared-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PorpnaRoutingModule } from './porpna-routing.module';

import { RouterLink } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { PainelControloComponent } from './resources/painel-controlo/painel-controlo.component';
import { CardContainerComponent } from './resources/painel-controlo/components/card-container/card-container.component';
import { CardComponent } from './resources/painel-controlo/components/card/card.component';
import { ApexContainerComponent } from './resources/painel-controlo/components/apex-container/apex-container.component';

// import { NgApexchartsModule } from 'ng-apexcharts';


@NgModule({
  declarations: [


    LayoutComponent,
          HeaderComponent,
          SidebarComponent,
          PainelControloComponent,
          CardContainerComponent,
          CardComponent,
          ApexContainerComponent,

  ],
  imports: [
    CommonModule,
    PorpnaRoutingModule,
    SharedComponentsModule,
    RouterLink,
    // NgApexchartsModule
  ]
})
export class PorpnaModule { }
