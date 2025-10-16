
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { ListarFormulariosComponent } from './listar-formularios/listar-formularios.component';
import { RegistarOuEditarFormularioComponent } from './registar-ou-editar-formulario/registar-ou-editar-formulario.component';

const routes: Routes = [

  {
    path: '',
    data: {
      breadcrumb: 'Todos os Formularios',
    },
    component: ListarFormulariosComponent,

  },
  {
    path: 'registo',
    data: {
      breadcrumb: 'Todos os Formularios',
    },
    component: RegistarOuEditarFormularioComponent,

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormulariosRoutingModule { }
