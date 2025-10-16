import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestInformacaoRoutingModule } from './gest-informacao-routing.module';
import { GestInformacaoComponent } from './gest-informacao.component';
import { DetalhesInformanteComponent } from './detalhes-informante/detalhes-informante.component';
import { FontesInformacaoComponent } from './fontes-informacao/fontes-informacao.component';
import { InformantesComponent } from './informantes/informantes.component';
import { RegistarOuEditarComponent } from './registos/registar-ou-editar/registar-ou-editar.component';
import { FemeninoComponent } from './registos/avatar/femenino/femenino.component';
import { MasculinoComponent } from './registos/avatar/masculino/masculino.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedcomponentsModule } from '@resources/modules/sicgo/shared/components/sharedcomponents.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GestInformacaoComponent,
    FontesInformacaoComponent,
    InformantesComponent,
    DetalhesInformanteComponent,
    RegistarOuEditarComponent,
    FemeninoComponent,
    MasculinoComponent
  ],
  imports: [
    CommonModule,
    GestInformacaoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    NgxPaginationModule,
    SharedcomponentsModule,
    EditorModule
  ]
})
export class GestInformacaoModule { }
