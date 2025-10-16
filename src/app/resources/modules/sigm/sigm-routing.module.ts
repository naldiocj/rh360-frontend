import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/auth.guard";
import { NgModule } from "@angular/core";
import { DashboardComponent } from "./resources/dashboard/dashboard.component";
import { LayoutComponent } from "./layout/layout.component";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        data: {
            breadcrumb: ''
        },
        children: [
            {
                path: 'dashboard',
                data: {
                    breadcrumb: 'Dashboard'
                },
                canActivate: [AuthGuard],
                component: DashboardComponent
            },
            {
                path: 'trabalho',
                data: {
                  breadcrumb: 'trabalho',
                },
                loadChildren: () =>
                  import(
                    './resources/trabalhos/trabalhos.module'
                  ).then((m) => m.TrabalhosModule)
              },
            {
                path: 'equipametos',
                data: {
                  breadcrumb: 'equipametos',
                },
                loadChildren: () =>
                  import(
                    './resources/equipamentos/equipamentos.module'
                  ).then((m) => m.EquipamentosModule)
              },
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class SigmRoutingModule {}