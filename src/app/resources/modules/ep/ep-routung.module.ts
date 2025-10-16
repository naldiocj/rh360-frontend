import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { AuthGuard } from "@core/guards/auth.guard";
import { DashboardComponent } from "../ep/resources/dashboard/dashboard.component";
import { NgModule } from "@angular/core";

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
                canActivate: [AuthGuard],
                path: 'denuncias',
                data: {
                  breadcrumb: 'denuncias',
                },
                loadChildren: () =>
                  import('./resources/denuncias/denuncias.module').then(
                    (m) => m.DenunciaModule
                  ),
              },
            {
                canActivate: [AuthGuard],
                path: 'comunidades',
                data: {
                  breadcrumb: 'comunidades',
                },
                loadChildren: () =>
                  import('./resources/comunidades/comunidades.module').then(
                    (m) => m.ComunidadeModule
                  ),
              },
            {
                canActivate: [AuthGuard],
                path: 'proveniencas',
                data: {
                  breadcrumb: 'proveniencas',
                },
                loadChildren: () =>
                  import('./resources/provenienca/provenienca.module').then(
                    (m) => m.ProveniencaModule
                  ),
              },
        ]
    }

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class EpRoutingModule {}