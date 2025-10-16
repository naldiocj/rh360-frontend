import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/auth.guard";
import { NgModule } from "@angular/core";
import { ProveniencasComponent } from "./proveniencas/proveniencas.component";

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
                path: 'provenienca',
                data: {
                    breadcrumb: 'provenienca',
                },
                component: ProveniencasComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class ProveniencasRoutingModule {}