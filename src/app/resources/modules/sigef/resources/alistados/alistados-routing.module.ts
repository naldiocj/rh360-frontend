import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/auth.guard";
import { ListarComponent } from "../alistados/listar/listar.component";
import { NgModule } from "@angular/core";




const routes: Routes = [
    {
        path: '',
        redirectTo: 'listar',
        pathMatch: 'full'
    },

    {
        path: '',
        canActivate: [AuthGuard],
        data: {
            breadcrumb: 'SIGEF',
        },

        children: [
            {
                path: 'registar-ou-editar',
                data: {
                    breadcrumb: 'Registar ou editar',
                },
            },

            {
                path: 'listar',
                data: {
                    breadcrumb: 'listar',
                },
                component: ListarComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AlistadosRoutingModule { }