import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GruposRoutingModule } from './grupos-routing.module';

import { NgxPaginationModule } from 'ngx-pagination';

// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import {ListarComponent} from "./listar/listar.component"
import { RegistarOuEditarComponent } from './registar-ou-editar/registar-ou-editar.component';
import { RegistarOuEditarHistoricoComponent } from './modal/registar-ou-editar-historico/registar-ou-editar-historico.component';
import { RegistoAssociarDelituosoComponent } from './modal/registo-associar-delituoso/registo-associar-delituoso.component';
import { GrupoViewComponent } from './grupo-view/grupo-view.component';
import { AssociarGruposComponent } from './modal/associar-grupos/associar-grupos.component';
import { RegistoGrupoAntecedenteComponent } from './modal/registo-antecedente/registo-antecedente.component';
import { RegistoModoOperanteGrupoComponent } from './modal/registo-modo-operante-grupo/registo-modo-operante-grupo.component';

@NgModule({
  declarations: [
    RegistarOuEditarComponent,
    ListarComponent,
    RegistarOuEditarHistoricoComponent,
    RegistoAssociarDelituosoComponent,
    GrupoViewComponent,
    AssociarGruposComponent,
    RegistoGrupoAntecedenteComponent,
    RegistoModoOperanteGrupoComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    GruposRoutingModule,
    NgSelect2Module,
    NgxPaginationModule
  ]
})
export class GruposModule { }
