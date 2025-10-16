import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
sair: any;
aceder_painel_piips: any;

  constructor() { }

  ngOnInit(): void {
  }

}
