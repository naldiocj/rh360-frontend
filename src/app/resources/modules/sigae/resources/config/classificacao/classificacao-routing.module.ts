import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/auth.guard";
import { ListaComponent } from "./resources/lista/lista.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "",
    pathMatch: "full",

    canActivate: [AuthGuard],

    children: [
      {
        path: "",
        component: ListaComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassificacaoRoutingModule {}
