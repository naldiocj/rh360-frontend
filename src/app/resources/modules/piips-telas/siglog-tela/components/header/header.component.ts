import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  auth: any;

  constructor() { }

  ngOnInit(): void {
  }
  sair() {
    this.auth.logout();
  }

  get aceder_painel_piips() {
    return this.auth.user.aceder_painel_piips
  }

}
