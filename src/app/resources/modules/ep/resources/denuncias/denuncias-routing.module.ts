import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/auth.guard";
import { NormalComponent } from "./normal/normal.component";
import { EmergenciasComponent } from "./emergencias/emergencias.component";
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
                path: 'emergencias',
                data: {
                    breadcrumb: 'emergencias',
                },
                component: EmergenciasComponent
            },
            {
                path: 'normal',
                data: {
                    breadcrumb: 'normal',
                },
                component: NormalComponent
            }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DenunciasRoutingModule {}