import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';

import { UtilizadorRoutingModule } from './utilizador-routing.module';
import { ListarComponent } from './listar/listar.component';
import { RegistarOuEditarModalComponent } from './registar-ou-editar/registar-ou-editar-modal.component';
import { ComponentsModule } from '@resources/modules/sigpq/shared/components/components.module';
import { RedefinirSenhaComponent } from './redefinir-senha/redefinir-senha.component';
import { EliminarComponent } from './eliminar/eliminar.component';
import { ActivaDesactivaComponent } from './activa-desactiva/activa-desactiva.component';


// import { ListarComponent } from './listar/listar.component';
// import { RegistarOuEditarModalComponent } from './registar-ou-editar/registar-ou-editar-modal.component';

@NgModule({
  declarations: [
    ListarComponent,
    RegistarOuEditarModalComponent,
    RedefinirSenhaComponent,
    EliminarComponent,
    ActivaDesactivaComponent,

  ],
  // exports: [RegistarOuEditarModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    UtilizadorRoutingModule,
    NgSelect2Module,
    ComponentsModule
  ]
})
export class UtilizadorModule { }
