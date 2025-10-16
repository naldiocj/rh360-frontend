import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/auth.guard";
import { ComunidadesComponent } from "./comunidades/comunidades.component";
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
            breadcrumb: 'EP',
        },
        children: [
            {
                path: 'comunidade',
                data: {
                    breadcrumb: 'comunidade',
                },
                component: ComunidadesComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class ComunidadesRoutingModule {}