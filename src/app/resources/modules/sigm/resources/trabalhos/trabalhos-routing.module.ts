import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/auth.guard";
import { NgModule } from "@angular/core";
import { TrabalhosComponent } from "./trabalhos/trabalhos.component";

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
                path: 'trabalhos',
                data: {
                    breadcrumb: 'trabalhos',
                },
                component: TrabalhosComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class TrabalhosRoutingModule {}