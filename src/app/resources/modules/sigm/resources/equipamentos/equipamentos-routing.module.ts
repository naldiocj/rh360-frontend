import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/auth.guard";
import { NgModule } from "@angular/core";
import { EquipamentosComponent } from "./equipamentos/equipamentos.component";


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
            breadcrumb: 'SIGM',
        },
        children: [
            {
                path: 'equipamento',
                data: {
                    breadcrumb: 'equipamento',
                },
                component: EquipamentosComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class EquipamentosRoutingModule {}