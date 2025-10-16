import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "@core/authentication/auth.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent {
  constructor(private auth: AuthService) {}

  sair() {
    this.auth.logout();
  }
}
