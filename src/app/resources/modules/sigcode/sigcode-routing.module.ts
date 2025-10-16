import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./resources/dashboard/dashboard.component";
import { ListarGuiaComponent } from "./resources/listar-guia/listar-guia.component";
import { ListarNipComponent } from "./resources/listar-nip/listar-nip.component";
import { ListarQrComponent } from "./resources/listar-qr/listar-qr.component";
import { BodyComponent } from "./layout/body/body.component";
import { NipComponent } from "./resources/nip/nip.component";
import { QrComponent } from "./resources/qr/qr.component";
import { GuiaComponent } from "./resources/guia/guia.component";
import { NaoAtribuidosComponent } from "./resources/nip-list/nao-atribuidos/nao-atribuidos.component";
import { AtribuidosComponent } from "./resources/nip-list/atribuidos/atribuidos.component";
import { HistoricoGuiaComponent } from "./resources/historico/historico-guia/historico-guia.component";
import { HistoricoNipComponent } from "./resources/historico/historico-nip/historico-nip.component";
import { MultinipComponent } from "./resources/multinip/multinip.component";
import { MultiQrcodeComponent } from "./resources/multi-qrcode/multi-qrcode.component";
import { LayoutComponent } from "./layout/layout.component";
import { QrwriteComponent } from "./resources/qrwrite/qrwrite.component";
  
const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "dashboard",
  },
  {
    path: "",
    component: BodyComponent,
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
      //  canActivate: [AuthGuard],
      },
    { path: "listar-nip", component: ListarNipComponent },
    { path: "listar-qr", component: ListarQrComponent },
    { path: "listar-guia", component: ListarGuiaComponent },
    { path: "nip", component: NipComponent },
    { path: "qr", component: QrComponent },
    { path: "guia", component: GuiaComponent },
    { path: "multinip", component: MultinipComponent },
    { path: "multiqrcode", component: MultiQrcodeComponent },
    { path: "Natribuidos", component: NaoAtribuidosComponent },
    { path: "atribuidos", component: AtribuidosComponent },
    { path: "guia-historico", component: HistoricoGuiaComponent },
    { path: "nip-historico", component: HistoricoNipComponent },
    { path: "gerar-texto", component: QrwriteComponent },
] },

];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SigcodeRoutingModule {
}